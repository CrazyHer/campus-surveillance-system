import { FC, useCallback } from 'react';
import { useIntl } from 'umi';
import locales from '../locales/zh-CN';

/**
 * 快速使用国际化formatMessage的Hook
 *
 * 使用方法:
 * ```jsx
 * export default ()=>{
 *  const f = useFmtMsg();
 *  return <div> { f('homepage.title') } </div>
 * }
 * ```
 * @returns formatMessage函数语法糖
 */
export function useFmtMsg() {
  const { formatMessage } = useIntl();
  return useCallback(
    (id: keyof typeof locales, value?: Record<string, any>) =>
      formatMessage({ id }, value),
    [],
  );
}

export function withFmtMsgHook(ClassComponent: any) {
  const WithFmtMsgHookWrapper: FC<any> = (props) => {
    const f = useFmtMsg();
    return <ClassComponent f={f} {...props} />;
  };
  return WithFmtMsgHookWrapper;
}

export function renderWithFmtMsg(
  renderer: (fmtMsgFunc: ReturnType<typeof useFmtMsg>) => any,
) {
  const FmtMsgWrapper: FC<any> = () => {
    const f = useFmtMsg();
    return renderer(f);
  };
  return <FmtMsgWrapper />;
}
