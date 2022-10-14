import React, {useState, useEffect} from 'react';
import {Button, Input, Heading, Text, Box, HStack, useToast} from 'native-base';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAt} from '@fortawesome/free-solid-svg-icons/faAt';
import {faKey} from '@fortawesome/free-solid-svg-icons/faKey';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import {ethers} from 'ethers';
import {CurrencyMeta} from '@stackupfinance/config';
import {
  AppColors,
  OnboardStackParamList,
  NetworksConfig,
  PaymasterStatus,
  GasEstimate,
} from '../../config';
import {StackScreenContainer, IconButton, SummaryTable} from '../../components';
import {
  useIntercomStoreEmailRecoverySelector,
  useWalletStoreEmailRecoverySelector,
  useGuardianStoreEmailRecoverySelector,
  useBundlerStoreEmailRecoverySelector,
  useSettingsStoreEmailRecoverySelector,
  useExplorerStoreEmailSelectorSelector,
  useMagicStoreEmailRecoverySelector,
} from '../../state';
import {useCurrencyBalances} from '../../hooks';
import {formatCurrency} from '../../utils/currency';
import {isValidEmail} from '../../utils/email';
import {logEvent} from '../../utils/analytics';

type Data = {
  email: string;
  newPassword: string;
  confirmPassword: string;
};

type Props = NativeStackScreenProps<OnboardStackParamList, 'EmailRecovery'>;

export default function EmailRecoveryScreen({navigation, route}: Props) {
  const toast = useToast();
  const {openMessenger} = useIntercomStoreEmailRecoverySelector();
  const {
    loading: walletLoading,
    getDataForWalletRecovery,
    updateEncryptedSigner,
  } = useWalletStoreEmailRecoverySelector();
  const {walletGuardians, buildRecoveryOps} =
    useGuardianStoreEmailRecoverySelector();
  const {
    loading: bundlerLoading,
    fetchPaymasterStatus,
    requestPaymasterSignature,
    verifyUserOperationsWithPaymaster,
    signUserOperations,
    relayUserOperations,
    clear: clearBundler,
  } = useBundlerStoreEmailRecoverySelector();
  const {network, defaultCurrency, timePeriod} =
    useSettingsStoreEmailRecoverySelector();
  const {
    loading: explorerLoading,
    walletStatus,
    fetchGasEstimate,
    fetchAddressOverview,
  } = useExplorerStoreEmailSelectorSelector();
  const {
    loading: magicLoading,
    loginWithEmailOTP,
    getMagicSigner,
    logoutFromMagic,
  } = useMagicStoreEmailRecoverySelector();
  const currencyBalances = useCurrencyBalances();
  const [paymasterStatus, setPaymasterStatus] = useState<PaymasterStatus>();
  const [gasEstimate, setGasEstimate] = useState<GasEstimate>();
  const [pendingLoading, setPendingLoading] = useState(false);
  const [data, setData] = useState<Data>({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const {walletAddress} = route.params;
  const isLoading =
    walletLoading ||
    bundlerLoading ||
    explorerLoading ||
    magicLoading ||
    pendingLoading;
  const maskedEmail = walletGuardians.magicAccountGuardian?.maskedEmail ?? '';

  const feeValue = paymasterStatus?.fees[defaultCurrency] ?? '0';
  const defaultCurrencyBalance = currencyBalances[defaultCurrency] ?? '0';
  const hasInsufficientFee = ethers.BigNumber.from(defaultCurrencyBalance).lt(
    feeValue,
  );
  const renderError = () => {
    let message;
    if (hasInsufficientFee) {
      message = `Not enough ${CurrencyMeta[defaultCurrency].name} to pay fees`;
    }

    return message ? (
      <Text
        textAlign="center"
        mt="8px"
        fontWeight={600}
        color={AppColors.singletons.warning}>
        {message}
      </Text>
    ) : undefined;
  };

  const onChangeTextHandler = (field: keyof Data) => (text: string) => {
    setData({...data, [field]: text});
  };

  useEffect(() => {
    (async () => {
      fetchAddressOverview(network, defaultCurrency, timePeriod, walletAddress);
      const [ps, ge] = await Promise.all([
        fetchPaymasterStatus(walletAddress, network),
        fetchGasEstimate(network),
      ]);
      setPaymasterStatus(ps);
      setGasEstimate(ge);
    })();
  }, []);

  const onHelpPress = () => {
    logEvent('OPEN_SUPPORT', {screen: 'EmailRecovery'});
    openMessenger();
  };

  const onBackPress = () => {
    logEvent('EMAIL_RECOVERY_BACK');
    navigation.goBack();
  };

  const navigateNextHandler = async () => {
    if (!paymasterStatus || !gasEstimate) {
      toast.show({
        title: 'Could not fetch transaction data. Reset and try again.',
        backgroundColor: AppColors.singletons.warning,
        placement: 'top',
      });
      return;
    }

    const {email, newPassword, confirmPassword} = data;
    if (!email || !newPassword || !confirmPassword) {
      toast.show({
        title: 'All fields are required',
        backgroundColor: AppColors.singletons.warning,
        placement: 'top',
      });
      return;
    } else if (!isValidEmail(email)) {
      toast.show({
        title: 'Email is not valid',
        backgroundColor: AppColors.singletons.warning,
        placement: 'top',
      });
      return;
    } else if (newPassword !== confirmPassword) {
      toast.show({
        title: "Passwords don't match",
        backgroundColor: AppColors.singletons.warning,
        placement: 'top',
      });
      return;
    }

    const [metadata, walletRecoveryData] = await Promise.all([
      loginWithEmailOTP(email),
      getDataForWalletRecovery(walletAddress, newPassword),
    ]);
    if (!metadata?.publicAddress) {
      toast.show({
        title: 'Cancelled email verification',
        backgroundColor: AppColors.singletons.warning,
        placement: 'top',
      });
      return;
    } else if (
      ethers.utils.getAddress(metadata.publicAddress) !==
      walletGuardians.magicAccountGuardian?.guardianAddress
    ) {
      toast.show({
        title: 'Incorrect email',
        backgroundColor: AppColors.singletons.warning,
        placement: 'top',
      });
      logoutFromMagic();
      return;
    }

    const userOps = buildRecoveryOps({
      instance: walletRecoveryData.currentInstance,
      network,
      walletStatus,
      paymasterStatus,
      gasEstimate,
      defaultCurrency,
      newOwner: walletRecoveryData.newOwner,
    });
    const userOpsWithPaymaster = await requestPaymasterSignature(
      userOps,
      network,
    );
    if (!verifyUserOperationsWithPaymaster(userOps, userOpsWithPaymaster)) {
      logoutFromMagic();
      clearBundler();
      toast.show({
        title: 'Transaction corrupted, contact us for help',
        backgroundColor: AppColors.singletons.warning,
        placement: 'bottom',
      });
      return;
    }

    const signedUserOps = await signUserOperations(
      walletRecoveryData.currentInstance,
      newPassword,
      network,
      userOpsWithPaymaster,
      {useGuardianSigner: getMagicSigner()},
    );
    if (!signedUserOps) {
      toast.show({
        title: 'Could not properly sign transaction',
        backgroundColor: AppColors.singletons.warning,
        placement: 'top',
      });
      logoutFromMagic();
      clearBundler();
      return;
    }

    toast.show({
      title: 'Transaction sent, this might take a minute...',
      backgroundColor: AppColors.palettes.primary[600],
      placement: 'bottom',
    });
    logoutFromMagic();
    logEvent('EMAIL_RECOVERY_TRANSACTION_CONFIRM');
    relayUserOperations(signedUserOps, network, status => {
      switch (status) {
        case 'PENDING':
          toast.show({
            title:
              'Transaction pending. Checking in 10 seconds. Please wait...',
            backgroundColor: AppColors.palettes.primary[600],
            placement: 'bottom',
          });
          setPendingLoading(true);
          setTimeout(() => {
            updateEncryptedSigner(
              walletRecoveryData.currentInstance,
              newPassword,
              walletRecoveryData.newEncryptedSigner,
            )
              .then(() => {
                navigation.goBack();
              })
              .catch(() => {
                setPendingLoading(false);
                toast.show({
                  title:
                    'Transaction failed after pending, contact us for help',
                  backgroundColor: AppColors.singletons.warning,
                  placement: 'bottom',
                });
              });
          }, 10000);
          break;

        case 'FAIL':
          toast.show({
            title: 'Transaction failed, contact us for help',
            backgroundColor: AppColors.singletons.warning,
            placement: 'bottom',
          });
          break;

        default:
          toast.show({
            title: 'Transaction completed!',
            backgroundColor: AppColors.singletons.good,
            placement: 'bottom',
          });
          updateEncryptedSigner(
            walletRecoveryData.currentInstance,
            newPassword,
            walletRecoveryData.newEncryptedSigner,
          );
          navigation.goBack();
          break;
      }
    });
  };

  return (
    <StackScreenContainer>
      <HStack justifyContent="space-between">
        <IconButton icon={faArrowLeft} onPress={onBackPress} />

        <Text fontWeight={500} fontSize="16px" color="text.4">
          2/2
        </Text>
      </HStack>

      <Heading mt="16px" fontWeight={600} fontSize="25px" textAlign="center">
        Use your linked email to reset your password
      </Heading>

      <Text mt="16px" fontSize="16px" color="text.3" textAlign="center">
        {`Use your email ${maskedEmail} to regain access to your wallet`}
      </Text>

      <Input
        mt="27px"
        placeholder="Enter your email address.."
        keyboardType="email-address"
        onChangeText={onChangeTextHandler('email')}
        leftElement={
          <Box ml="13px">
            <FontAwesomeIcon icon={faAt} color={AppColors.text[5]} size={18} />
          </Box>
        }
      />

      <Input
        mt="8px"
        type="password"
        placeholder="New password..."
        onChangeText={onChangeTextHandler('newPassword')}
        leftElement={
          <Box ml="13px">
            <FontAwesomeIcon icon={faKey} color={AppColors.text[5]} size={18} />
          </Box>
        }
      />

      <Input
        mt="8px"
        type="password"
        placeholder="Confirm password..."
        onChangeText={onChangeTextHandler('confirmPassword')}
        leftElement={
          <Box ml="13px">
            <FontAwesomeIcon icon={faKey} color={AppColors.text[5]} size={18} />
          </Box>
        }
      />

      <Box w="100%" mt="18px">
        <SummaryTable
          rows={[
            {
              isLoading,
              key: 'Fee',
              value: formatCurrency(
                paymasterStatus?.fees[defaultCurrency] ?? '0',
                defaultCurrency,
              ),
            },
            {
              key: 'Network',
              value: NetworksConfig[network].name,
              color: NetworksConfig[network].color,
            },
          ]}
        />
      </Box>

      {!isLoading && renderError()}

      <Box flex={1} />

      <Button
        w="100%"
        variant="link"
        onPress={onHelpPress}
        _text={{textAlign: 'center', fontWeight: 600, fontSize: '14px'}}>
        Need help? Start live chat
      </Button>

      <Button isLoading={isLoading} onPress={navigateNextHandler} mt="8px">
        Continue
      </Button>
    </StackScreenContainer>
  );
}
