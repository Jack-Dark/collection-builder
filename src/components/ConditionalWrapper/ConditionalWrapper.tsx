import type { ConditionalWrapperPropsDef } from './ConditionalWrapper.types';

/**
 * If `condition === true`, wraps the `children` with the `Wrapper`, otherwise returns the `children`.
 *
 * Usage:
 * ```tsx
 * <ConditionalWrapper
 *   condition={boolean}
 *   Wrapper={({ children }) => {
 *     return (
 *       <WrapperComponent myProp={value}>
 *         {children}
 *       </WrapperComponent>
 *     );
 *   }}
 * >
 *   // children
 * </ConditionalWrapper>
 * ```
 */
export const ConditionalWrapper = (props: ConditionalWrapperPropsDef) => {
  const { children, condition, Wrapper } = props;

  return condition ? <Wrapper>{children}</Wrapper> : children;
};
