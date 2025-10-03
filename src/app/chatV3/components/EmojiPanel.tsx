import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, InteractionManager } from 'react-native';
import emojisData from '../components/EmojisPiker/emojis.json';

type EmojiPanelProps = {
  onSelect: (emoji: string) => void;
  maxHeight?: number;
  itemSize?: number;
};

type RawEmojiEntry =
  | string
  | { text?: string; alt?: string; emoji?: string; annotation?: string; name?: string; group?: number };

type NormalizedEmoji = { text: string; group?: number };

const normalize = (data: unknown): NormalizedEmoji[] => {
  if (!Array.isArray(data)) return [];
  const list = data as RawEmojiEntry[];
  return list
    .map((it) => {
      if (typeof it === 'string') return { text: it, group: undefined } as NormalizedEmoji;
      const text = (it.text || it.emoji || it.alt || it.annotation || it.name || '').toString();
      const group = typeof it.group === 'number' ? it.group : undefined;
      return { text, group } as NormalizedEmoji;
    })
    .filter((e) => !!e.text);
};

const defaultEmojis: NormalizedEmoji[] = [
  { text: '😀' }, { text: '😁' }, { text: '😂' }, { text: '🤣' },
  { text: '😊' }, { text: '😍' }, { text: '😘' }, { text: '👍' },
  { text: '🙏' }, { text: '🎉' }, { text: '🔥' }, { text: '✨' },
  { text: '💪' }, { text: '🤝' }, { text: '🎁' },
];

// 将两位字母国家码转为旗帜区域指示符表情（如 "CN" -> 🇨🇳）
const toFlagEmoji = (code: string): string => {
  if (!code || code.length !== 2) return code;
  const upper = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return code;
  const A = 0x1f1e6; // Regional Indicator Symbol Letter A
  const first = A + (upper.charCodeAt(0) - 65);
  const second = A + (upper.charCodeAt(1) - 65);
  try {
    return String.fromCodePoint(first) + String.fromCodePoint(second);
  } catch {
    return code;
  }
};

// 判断是否为旗帜相关的序列（区域指示符、ZWJ等）
const isFlagLike = (value: string): boolean => {
  if (!value) return false;
  const hasRegional = /[\u{1F1E6}-\u{1F1FF}]/u.test(value);
  const hasZWJ = value.includes('\u200d');
  const hasVS = value.includes('\uFE0F');
  return hasRegional || hasZWJ || hasVS;
};

// 将任意 emoji 转为 twemoji PNG URL（适配 web 与 RN Image）
const emojiToTwemojiPngUrl = (emojiText: string): string => {
  const codePoints = Array.from(emojiText).map((c) => c.codePointAt(0) || 0);
  const hex = codePoints.map((cp) => cp.toString(16)).join('-');
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${hex}.png`;
};

const EmojiPanel: React.FC<EmojiPanelProps> = ({ onSelect, maxHeight = 240, itemSize = 24 }) => {
  const [activeTab, setActiveTab] = React.useState<'recent' | number>('recent');
  const allEmojis = React.useMemo<NormalizedEmoji[]>(() => {
    const normalized = normalize(emojisData);
    return normalized.length ? normalized : defaultEmojis;
  }, []);

  const groups = React.useMemo<number[]>(() => {
    const set = new Set<number>();
    for (const e of allEmojis) if (typeof e.group === 'number') set.add(e.group);
    return Array.from(set).sort((a, b) => a - b);
  }, [allEmojis]);

  // 🚨 优化：使用 useMemo 缓存常用表情，避免频繁重新计算
  const [recent, setRecent] = React.useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('emoji_recent') || '[]';
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? (arr as string[]).slice(0, 30) : [];
    } catch {
      return [];
    }
  });

  // 🚨 优化：使用 useRef 存储待更新的表情，避免立即更新UI
  const pendingEmojis = React.useRef<string[]>([]);
  const updateTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // 🚨 优化：延迟更新常用表情列表，类似微信的行为
  const updateRecentEmojis = React.useCallback(() => {
    if (pendingEmojis.current.length === 0) return;
    
    const newEmojis = [...pendingEmojis.current];
    pendingEmojis.current = [];
    
    setRecent((prev) => {
      const updated = [...prev];
      newEmojis.forEach(emoji => {
        // 移除已存在的，然后添加到开头
        const index = updated.indexOf(emoji);
        if (index > -1) {
          updated.splice(index, 1);
        }
        updated.unshift(emoji);
      });
      
      // 限制为30个
      const final = updated.slice(0, 30);
      
      // 异步保存到本地存储
      try {
        localStorage.setItem('emoji_recent', JSON.stringify(final));
      } catch (error) {
        console.warn('保存表情历史失败:', error);
      }
      
      return final;
    });
  }, []);

  // 🚨 优化：快速响应的表情选择，使用 InteractionManager 确保优先响应
  const pick = React.useCallback((t: string) => {
    if (!t) return;
    
    const inserted = t.length === 2 ? toFlagEmoji(t) : t;
    
    // 🚨 立即调用 onSelect，确保快速响应
    onSelect(inserted);
    
    // 🚨 使用 InteractionManager 确保在交互完成后才进行复杂操作
    InteractionManager.runAfterInteractions(() => {
      // 添加到待更新列表，但不立即更新UI
      pendingEmojis.current.push(inserted);
      
      // 清除之前的定时器，设置新的延迟更新
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      // 延迟500ms更新常用列表，类似微信的行为
      updateTimeoutRef.current = setTimeout(() => {
        updateRecentEmojis();
      }, 500);
    });
  }, [onSelect, updateRecentEmojis]);

  // 🚨 优化：预计算表情显示内容，避免重复计算
  const emojiDisplayCache = React.useMemo(() => {
    const cache = new Map<string, { display: string; isImage: boolean; uri?: string }>();
    
    const processEmoji = (emoji: string) => {
      if (cache.has(emoji)) return cache.get(emoji)!;
      
      const display = emoji.length === 2 ? toFlagEmoji(emoji) : emoji;
      const isImage = isFlagLike(display);
      const result = {
        display,
        isImage,
        uri: isImage ? emojiToTwemojiPngUrl(display) : undefined
      };
      
      cache.set(emoji, result);
      return result;
    };
    
    return processEmoji;
  }, []);

  // 🚨 清理定时器
  React.useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // 🚨 优化：预定义样式对象，避免内联样式
  const emojiItemStyle = React.useMemo(() => ({
    width: '12.5%' as const,
    paddingVertical: 6,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  }), []);

  // 🚨 优化：使用 useCallback 优化 pick 函数
  const pickOptimized = React.useCallback((t: string) => {
    pick(t);
  }, [pick]);

  // 🚨 优化：单独的 EmojiItem 组件，使用 React.memo 和缓存
  const EmojiItem = React.memo<{ emoji: string; index: number }>(({ emoji, index }) => {
    const handlePress = React.useCallback(() => {
      pickOptimized(emoji);
    }, [emoji, pickOptimized]);

    const emojiData = React.useMemo(() => {
      return emojiDisplayCache(emoji);
    }, [emoji, emojiDisplayCache]);

    const emojiElement = React.useMemo(() => {
      if (emojiData.isImage && emojiData.uri) {
        return <Image source={{ uri: emojiData.uri }} style={{ width: itemSize, height: itemSize }} />;
      }
      return <Text style={{ fontSize: itemSize }}>{emojiData.display}</Text>;
    }, [emojiData, itemSize]);

    return (
      <TouchableOpacity
        key={`${emoji}-${index}`}
        onPress={handlePress}
        style={emojiItemStyle}
        activeOpacity={0.7}
      >
        {emojiElement}
      </TouchableOpacity>
    );
  });

  // 🚨 优化：使用 React.memo 优化 Grid 组件，避免不必要的重新渲染
  const Grid = React.memo<{ data: string[] }>(({ data }) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {data.map((emoji, idx) => (
        <EmojiItem key={`${emoji}-${idx}`} emoji={emoji} index={idx} />
      ))}
    </View>
  ));

  // 🚨 优化：使用 useMemo 缓存当前显示的表情数据
  const currentEmojis = React.useMemo(() => {
    if (activeTab === 'recent') {
      return recent;
    }
    return allEmojis.filter((e) => e.group === activeTab).map((e) => e.text);
  }, [activeTab, recent, allEmojis]);

  return (
    <View style={{ backgroundColor: '#fff', height: maxHeight, borderTopWidth: 1, borderTopColor: '#eee' }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 40 }}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
      >
        <TouchableOpacity onPress={() => setActiveTab('recent')} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 14, color: activeTab === 'recent' ? '#2D9DFE' : '#666' }}>常用</Text>
        </TouchableOpacity>
        {groups.map((g) => {
          const raw = (allEmojis.find((e) => e.group === g)?.text) || '🙂';
          const label = raw.length === 2 ? toFlagEmoji(raw) : raw;
          const active = activeTab === g;
          return (
            <TouchableOpacity key={g} onPress={() => setActiveTab(g)} style={{ marginRight: 12 }}>
              <Text style={{ fontSize: 16, color: active ? '#2D9DFE' : '#666' }}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 6, paddingBottom: 8 }}>
        <Grid data={currentEmojis} />
      </ScrollView>
    </View>
  );
};

export default EmojiPanel;


