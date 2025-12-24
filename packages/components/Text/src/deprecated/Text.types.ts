import type { ITextProps as INativeTextProps } from '@elui-react-native/adapters';
import type { FontTokens, FontVariantTokens, IForegroundColorTokens, IColorTokens } from '@elui-react-native/tokens';

export const textName = 'RNFText';

/**
 * Properties for fabric native text field, these extend the default props for text
 */
export type ITextProps<TBase = INativeTextProps> = TBase &
  FontVariantTokens &
  IForegroundColorTokens & {
    disabled?: boolean;
  };

export type ITextType<TBase = INativeTextProps> = {
  props: ITextProps<TBase>;
  tokens: FontTokens & IColorTokens;
  slotProps: {
    root: TBase;
  };
};
