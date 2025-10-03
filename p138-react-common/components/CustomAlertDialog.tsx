import type {ButtonProps} from 'tamagui';
import {AlertDialog, Button, styled, XStack, YStack} from 'tamagui';

interface CustomAlertDialogProps {
  /** 触发器节点 */
  trigger?: React.ReactNode;
  /** 标题 */
  title?: string;
  /** 描述内容 */
  description?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 确认按钮文本 */
  confirmText?: string;
  /** 取消回调 */
  onCancel?: () => void;
  /** 确认回调 */
  onConfirm?: () => void;
  /** 是否显示 */
  open?: boolean;
  /** 显示状态改变回调 */
  onOpenChange?: (open: boolean) => void;
  /** 取消按钮属性 */
  cancelButtonProps?: ButtonProps;
  /** 确认按钮属性 */
  confirmButtonProps?: ButtonProps;
  /** 内容区域样式 */
  contentProps?: React.ComponentProps<typeof AlertDialog.Content>;
  /** 遮罩层样式 */
  overlayProps?: React.ComponentProps<typeof AlertDialog.Overlay>;
}

const StyledContent = styled(AlertDialog.Content, {
  backgroundColor: 'white',
  borderRadius: 8,
  padding: 20,
  maxWidth: '90%',
  width: 320,
});

const CustomAlertDialog = ({
  trigger = <Button>打开</Button>,
  title = '提示',
  description = '',
  cancelText = '取消',
  confirmText = '确定',
  onCancel,
  onConfirm,
  open,
  onOpenChange,
  cancelButtonProps,
  confirmButtonProps,
  contentProps,
  overlayProps,
}: CustomAlertDialogProps) => {
  return (
    <AlertDialog native open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{opacity: 0}}
          exitStyle={{opacity: 0}}
          {...overlayProps}
        />
        <StyledContent
          bordered
          elevate
          key="content"
          animation={['quick']}
          enterStyle={{x: 0, y: -20, opacity: 0, scale: 0.9}}
          exitStyle={{x: 0, y: 10, opacity: 0, scale: 0.95}}
          {...contentProps}>
          <YStack gap="$4">
            <AlertDialog.Title size="$6">{title}</AlertDialog.Title>
            <AlertDialog.Description color="#000">
              {description}
            </AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild onPress={onCancel}>
                <Button {...cancelButtonProps}>{cancelText}</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild onPress={onConfirm}>
                <Button
                  style={{
                    backgroundColor: '#f53b57',
                    color: 'white',
                  }}
                  {...confirmButtonProps}>
                  {confirmText}
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </StyledContent>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
