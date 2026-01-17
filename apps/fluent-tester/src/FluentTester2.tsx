import * as React from 'react';
import {
  View,
  Platform,
  SafeAreaView,
  I18nManager,
  NativeEventSubscription,
} from 'react-native';

import { Separator, TextV1 as Text } from '@elui/react-native';
import { ButtonV1 as Button } from '@elui-react-native/button';
import { BASE_TESTPAGE, } from '@elui-react-native/e2e-testing';
import { ROOT_VIEW } from '@elui-react-native/e2e-testing';
import type { Theme } from '@elui-react-native/framework';
import { useTheme } from '@elui-react-native/theme-types';
import { themedStyleSheet } from '@elui-react-native/themed-stylesheet';

import { fluentTesterStyles } from './TestComponents/Common/styles';
import { testProps } from './TestComponents/Common/TestProps';
import { ThemePickers } from './theme/ThemePickers';

// import {default as ContextualMenuTesting} from './ContextualMenuTesting';
import {default as PlatformColorTesting} from './PlatformColorTesting';
// uncomment the below lines to enable message spy
/**
import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue';
MessageQueue.spy(true);
 */

export interface FluentTesterProps {
  enableSinglePaneView?: boolean;
}

interface HeaderProps {
  enableSinglePaneView?: boolean;
  enableBackButtonIOS?: boolean;
  onBackButtonPressedIOS?: () => void;
}

const getThemedStyles = themedStyleSheet((t: Theme) => {
  return {
    root: {
      backgroundColor: t.colors.neutralBackground1,
      flex: 1,
      flexGrow: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      padding: 4,
    },
    testSeparator: {
      borderColor: t.colors.menuDivider,
      borderWidth: 0.1,
    },
  };
});

const HeaderSeparator = Separator.customize((t) => ({
  color: t.colors.bodyFrameDivider,
  separatorWidth: 2,
}));


const Header: React.FunctionComponent<HeaderProps> = React.memo((props) => {
  const { enableSinglePaneView, enableBackButtonIOS, onBackButtonPressedIOS } = props;
  const theme = useTheme();

  const headerStyle = enableSinglePaneView ? fluentTesterStyles.headerWithBackButton : fluentTesterStyles.header;

  const backButtonTitle = I18nManager.isRTL ? 'Back ›' : '‹ Back';

  return (
    <View style={headerStyle}>
      <Text
        style={fluentTesterStyles.testHeader}
        variant="heroLargeSemibold"
        color={theme.host.palette?.TextEmphasis}
        /* For Android E2E testing purposes, testProps must be passed in after accessibilityLabel. */
        {...testProps(BASE_TESTPAGE)}
      >
        ⚛ FluentUI Tests
      </Text>
      <View style={fluentTesterStyles.header}>
        {/* On iPhone, We need a back button. Android has an OS back button, while desktop platforms have a two-pane view */}
        {Platform.OS === 'ios' && !Platform.isPad && (
          <Button
            appearance="subtle"
            style={fluentTesterStyles.backButton}
            onClick={onBackButtonPressedIOS}
            disabled={!enableBackButtonIOS}
          >
            {backButtonTitle}
          </Button>
        )}
        <ThemePickers />
      </View>
    </View>
  );
});

export const FluentTester: React.FunctionComponent<FluentTesterProps> = (props: FluentTesterProps) => {
  const { enableSinglePaneView } = props;

  const [onTestListView, setOnTestListView] = React.useState(true);
  const theme = useTheme();
  const themedStyles = getThemedStyles(theme);
  const backHandlerSubscriptionRef = React.useRef<NativeEventSubscription | null>(null);

  const onBackPress = React.useCallback(() => {
    setOnTestListView(true);
    if (Platform.OS === 'android') {
      backHandlerSubscriptionRef.current?.remove();
      backHandlerSubscriptionRef.current = null;
    }
    return true;
  }, []);

  // This is used to initially bring focus to the app on win32
  const focusOnMountRef = React.useRef<View>(null);

  React.useEffect(() => {
    if (Platform.OS === ('win32' as any)) {
      focusOnMountRef.current.focus();
    }
  }, []);

  const RootView = Platform.select({
    ios: SafeAreaView,
    default: View,
  });


  //const [counter, setCounter] = useState(0);
  //const viewRef = React.useRef<any>(null);
  return (
    // On iOS, the accessible prop must be set to false because iOS does not support nested accessibility elements
    <RootView
      style={themedStyles.root}
      accessible={Platform.OS !== 'ios'}
      /* For Android E2E testing purposes, testProps must be passed in after accessibilityLabel. */
      {...testProps(ROOT_VIEW)}
    >
      <Header enableSinglePaneView={enableSinglePaneView} enableBackButtonIOS={!onTestListView} onBackButtonPressedIOS={onBackPress} />
      <HeaderSeparator />
      <View style={fluentTesterStyles.testRoot}>
        <PlatformColorTesting/>
      </View>
    </RootView>
  );
};
