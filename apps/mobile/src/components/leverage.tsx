import React from 'react';
import {Box, HStack, Text, Center, Button} from 'native-base';
import {BigNumberish} from 'ethers';
import {faArrowsUpDown} from '@fortawesome/free-solid-svg-icons/faArrowsUpDown';
import {faBolt} from '@fortawesome/free-solid-svg-icons/faBolt';

import {CurrencySymbols, CurrencyBalances} from '@stackupfinance/config';
import {CurrencyInput, DropdownButton, IconButton} from '.';
import {formatCurrency} from '../utils/currency';

type Props = {
  isDisabled?: boolean;
  baseCurrency: CurrencySymbols;
  quoteCurrency: CurrencySymbols;
  baseCurrencyValue: BigNumberish;
  quoteCurrencyValue: BigNumberish;
  currencyBalances: CurrencyBalances;
  onBaseCurrencyPress: () => void;
  onQuoteCurrencyPress: () => void;
  onBaseCurrencyValueChange: (value: BigNumberish) => void;
  onSwapPress: () => void;
};

export const Leverage = ({
  isDisabled,
  baseCurrency,
  quoteCurrency,
  baseCurrencyValue,
  quoteCurrencyValue,
  currencyBalances,
  onBaseCurrencyPress,
  onQuoteCurrencyPress,
  onBaseCurrencyValueChange,
  onSwapPress,
}: Props) => {
  return (
    <Box px="12px">
      <HStack mb="12px" justifyContent="space-between" alignItems="center">
        <Text fontWeight={500} color="text.2">
          Risk
        </Text>

        <Text fontWeight={500} color="text.2">
          Balance:{' '}
          <Text fontWeight={500} color="white">
            {formatCurrency(
              currencyBalances[baseCurrency] ?? '0',
              baseCurrency,
            )}
          </Text>
        </Text>
      </HStack>

      <HStack mb="12px" justifyContent="center" alignItems="center">
        <Box flex={1}>
          <DropdownButton
            isDisabled={isDisabled}
            currency={baseCurrency}
            onPress={onBaseCurrencyPress}
          />
        </Box>

        <Box flex={1}>
          <CurrencyInput
            isDisabled={isDisabled}
            value={baseCurrencyValue}
            currency={baseCurrency}
            onValueChange={onBaseCurrencyValueChange}
          />
        </Box>
      </HStack>

      <Box mb="12px" justifyContent="center" alignItems="center">
        <Center rounded="full" backgroundColor="background.3" w="40px" h="40px">
          <IconButton
            isDisabled={isDisabled}
            icon={faBolt}
            // onPress={onSwapPress}
          />
        </Center>
      </Box>

      <Button.Group isAttached colorScheme="blue" mx={{ base: "auto" }} size="sm">
        <Button variant="outline">x2</Button>
        <Button variant="outline">x3</Button>
        <Button variant="outline">x4</Button>
        <Button variant="outline">x5</Button>
        <Button variant="outline">x6</Button>
        {/* <Button variant="outline">Save</Button> */}
      </Button.Group>;


      <HStack justifyContent="center" alignItems="center">
        <Box flex={1}>
          <DropdownButton
            isDisabled={isDisabled}
            currency={quoteCurrency}
            onPress={onQuoteCurrencyPress}
          />
        </Box>

        <Box flex={1}>
          <CurrencyInput
            isDisabled={isDisabled}
            isEditable={false}
            value={quoteCurrencyValue}
            currency={quoteCurrency}
          />
        </Box>
      </HStack>
    </Box>
  );
};
