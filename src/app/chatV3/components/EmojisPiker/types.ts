export interface EmojisPikerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
  columns?: number;
}


