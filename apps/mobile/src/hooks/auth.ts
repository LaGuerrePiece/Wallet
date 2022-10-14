import {useEffect, useState, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {
  useWalletStoreRemoveWalletSelector,
  useWalletStoreAuthSelector,
  useFingerprintStoreAuthSelector,
  useFingerprintStoreRemoveWalletSelector,
  useNavigationStoreRemoveWalletSelector,
  useIntercomStoreRemoveWalletSelector,
  useIntercomStoreAuthSelector,
  useSettingsStoreRemoveWalletSelector,
  useExplorerStoreRemoveWalletSelector,
  useBundlerStoreRemoveWalletSelector,
  useRampStoreRemoveWalletSelector,
  useRampStoreAuthSelector,
  useSwapStoreRemoveWalletSelector,
  useWalletConnectStoreRemoveWalletSelector,
  useBrowserStoreAuthSelector,
  useBrowserStoreRemoveWalletSelector,
  useNotificationStoreRemoveWalletSelector,
  useNotificationStoreAuthSelector,
  useMagicStoreRemoveWalletSelector,
  useGuardianStoreRemoveWalletSelector,
} from '../state';

interface UseAuthHook {
  isReady: boolean;
  hasWalletInstance: boolean;
}
interface AppStateDelta {
  prev: AppStateStatus;
  curr: AppStateStatus;
}
type UseRemoveWalletHook = () => Promise<void>;

export const useRemoveWallet = (): UseRemoveWalletHook => {
  const {remove} = useWalletStoreRemoveWalletSelector();
  const {resetMasterPassword} = useFingerprintStoreRemoveWalletSelector();
  const {clear: clearNavigation} = useNavigationStoreRemoveWalletSelector();
  const {clear: clearIntercom} = useIntercomStoreRemoveWalletSelector();
  const {clear: clearSettings} = useSettingsStoreRemoveWalletSelector();
  const {clear: clearExplorer} = useExplorerStoreRemoveWalletSelector();
  const {clear: clearBundler} = useBundlerStoreRemoveWalletSelector();
  const {clear: clearRamp} = useRampStoreRemoveWalletSelector();
  const {clear: clearSwap} = useSwapStoreRemoveWalletSelector();
  const {clear: clearWalletConnect} =
    useWalletConnectStoreRemoveWalletSelector();
  const {clear: clearBrowser} = useBrowserStoreRemoveWalletSelector();
  const {clear: clearNotification} = useNotificationStoreRemoveWalletSelector();
  const {clear: clearMagic} = useMagicStoreRemoveWalletSelector();
  const {clear: clearGuardian} = useGuardianStoreRemoveWalletSelector();

  return async () => {
    // Clear all state here before removing wallet from device.
    clearNavigation();
    clearIntercom();
    clearSettings();
    clearExplorer();
    clearBundler();
    clearRamp();
    clearSwap();
    clearWalletConnect();
    clearBrowser();
    clearNotification();
    clearMagic();
    clearGuardian();

    resetMasterPassword();
    remove();
  };
};

export const useAuth = (): UseAuthHook => {
  const {instance, hasHydrated: walletHydrated} = useWalletStoreAuthSelector();
  const {
    isEnabled: isFingerprintEnabled,
    checkDevice,
    getMasterPassword,
    hasHydrated: fingerprintHydrated,
  } = useFingerprintStoreAuthSelector();
  const {
    identify,
    debounceAndroidAppState: debounceAndroidAppStateIntercom,
    setDebounceAndroidAppState: setDebounceAndroidAppStateIntercom,
  } = useIntercomStoreAuthSelector();
  const {
    debounceAndroidAppState: debounceAndroidAppStateRamp,
    setDebounceAndroidAppState: setDebounceAndroidAppStateRamp,
  } = useRampStoreAuthSelector();
  const {
    debounceAndroidAppState: debounceAndroidAppStateBrowser,
    setDebounceAndroidAppState: setDebounceAndroidAppStateBrowser,
  } = useBrowserStoreAuthSelector();
  const {updateFCMToken, requestPermission} =
    useNotificationStoreAuthSelector();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [hasWalletInstance, setHasWalletInstance] = useState<boolean>(false);
  const [appStateDelta, setAppStateDelta] = useState<AppStateDelta>({
    prev: AppState.currentState,
    curr: AppState.currentState,
  });
  const isFingerprintEnabledRef = useRef<boolean>(isFingerprintEnabled);
  const hasWalletInstanceRef = useRef<boolean>(hasWalletInstance);
  const appStateDeltaRef = useRef<AppStateDelta>(appStateDelta);
  const debounceAndroidAppStateIntercomRef = useRef<boolean>(
    debounceAndroidAppStateIntercom,
  );
  const debounceAndroidAppStateRampRef = useRef<boolean>(
    debounceAndroidAppStateRamp,
  );
  const debounceAndroidAppStateBrowserRef = useRef<boolean>(
    debounceAndroidAppStateBrowser,
  );

  const hasHydrated = walletHydrated && fingerprintHydrated;
  isFingerprintEnabledRef.current = isFingerprintEnabled;
  hasWalletInstanceRef.current = hasWalletInstance;
  appStateDeltaRef.current = appStateDelta;
  debounceAndroidAppStateIntercomRef.current = debounceAndroidAppStateIntercom;
  debounceAndroidAppStateRampRef.current = debounceAndroidAppStateRamp;
  debounceAndroidAppStateBrowserRef.current = debounceAndroidAppStateBrowser;

  const showUnlockPrompt = async () => {
    setIsReady(false);

    setTimeout(async () => {
      try {
        const password = await getMasterPassword();
        password ? setIsReady(true) : showUnlockPrompt();
      } catch (_error) {
        showUnlockPrompt();
      }
    });
  };

  useEffect(() => {
    if (hasHydrated) {
      checkDevice();
      setHasWalletInstance(Boolean(instance.encryptedSigner));
      setIsReady(true);

      if (instance.encryptedSigner) {
        identify(instance.walletAddress);
        updateFCMToken(instance.walletAddress);
        requestPermission();
      }
    }
  }, [hasHydrated, instance]);

  useEffect(() => {
    const listener = AppState.addEventListener('change', async state => {
      const delta: AppStateDelta = {
        prev: appStateDeltaRef.current.curr,
        curr: state,
      };

      if (
        hasWalletInstanceRef.current &&
        isFingerprintEnabledRef.current &&
        delta.prev === 'background' &&
        delta.curr === 'active'
      ) {
        if (debounceAndroidAppStateIntercomRef.current) {
          setDebounceAndroidAppStateIntercom(false);
        } else if (debounceAndroidAppStateRampRef.current) {
          setDebounceAndroidAppStateRamp(false);
        } else if (debounceAndroidAppStateBrowserRef.current) {
          setDebounceAndroidAppStateBrowser(false);
        } else {
          showUnlockPrompt();
        }
      }

      setAppStateDelta(delta);
    });

    return listener.remove;
  }, []);

  return {
    isReady,
    hasWalletInstance,
  };
};
