/**
 * 会话项共享样式
 */

import {StyleSheet} from 'react-native';

export const conversationItemStyles = StyleSheet.create({
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#2D9DFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  unreadBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF381F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  conversationContent: {
    flex: 1,
    marginLeft: 12,
    height: 48,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conversationTitle: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
  },
  pinnedIcon: {
    fontSize: 12,
    color: '#2D9DFE',
  },
  timeText: {
    fontSize: 12,
    color: '#88909B',
    marginLeft: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(81,94,112,0.8)',
  },
  muteIcon: {
    fontSize: 12,
    marginLeft: 8,
  },
  // 组合头像样式
  combinedAvatarContainer: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  combinedAvatar: {
    width: 16,
    height: 16,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#fff',
    marginRight: 1,
    marginBottom: 1,
  },
  combinedAvatarImage: {
    width: '100%',
    height: '100%',
  },
});
