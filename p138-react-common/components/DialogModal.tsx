import {Image} from 'expo-image';
import {TouchableOpacity} from 'react-native';
import {Adapt, Button, Dialog, Sheet, Unspaced, XStack} from 'tamagui';

export interface DialogModalProps {
  children: React.ReactNode;
  disableAdapt?: boolean;
  buttonText?: string;
  triggerContent?: React.ReactNode;
}

export function DialogInstance({
  disableAdapt = false,
  children,
  buttonText = 'Open Dialog',
  triggerContent,
}: DialogModalProps) {
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        {triggerContent || <Button>{buttonText}</Button>}
      </Dialog.Trigger>

      {!disableAdapt && (
        <Adapt when="sm" platform="touch">
          <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
            <Sheet.Frame padding="$4" gap="$4">
              <Adapt.Contents />
            </Sheet.Frame>
            <Sheet.Overlay
              backgroundColor="$shadow6"
              animation="lazy"
              enterStyle={{opacity: 0}}
              exitStyle={{opacity: 0}}
            />
          </Sheet>
        </Adapt>
      )}

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          backgroundColor="$shadow6"
          animation="slow"
          enterStyle={{opacity: 0}}
          exitStyle={{opacity: 0}}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quicker',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{x: 0, y: -20, opacity: 0, scale: 0.9}}
          exitStyle={{x: 0, y: 10, opacity: 0, scale: 0.95}}
          gap="$4">
          {children}
          <XStack
            position="absolute"
            bottom={-30}
            right={0}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '90%',
            }}>
            <Unspaced>
              <Dialog.Close
                asChild
                style={{alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Image
                    source={require('src/assets/imgs/home/close2.png')}
                    style={{width: 30, height: 30}}
                  />
                </TouchableOpacity>
              </Dialog.Close>
            </Unspaced>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
