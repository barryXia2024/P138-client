import { FlatList } from '@/p138-react-common/components/FlatList';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { listLiveStream } from 'src/api/interface/competition-live-stream';
import AnchorListCard from 'src/modules/live/ancre/card';
import { useUserStore } from 'src/store';
import { useAnchorStore } from '../store/anchorStore';
;


export default function AnchorList() {
  const [data, setData] = useState<ServerCommonLive.ListLiveStreamResult>();
  const {loginInfo,userInfo} = useUserStore();
  const [loading, setLoading] = useState(true);
  const {isAnchor,setIsAnchor} = useAnchorStore();

  useEffect(() => {
    listLiveStream({  }).then(res => {
      const uids =  res.data?.list?.map(item => item.uid);
      console.log(uids,userInfo)
      const isAnchor = uids?.includes(loginInfo?.userID);
    
      setIsAnchor(isAnchor??false);
      setData(res.data);

      setLoading(false);
    });
  }, []);

  if (loading) return <ActivityIndicator />;
  const list = isAnchor ? data?.list?.filter(item => item.uid === loginInfo?.userID) : data?.list;
  return (
    <FlatList
      data={list ?? []}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => <AnchorListCard data={item} />}
      contentContainerStyle={{ backgroundColor: '#f5f5f5', paddingBottom: 16 }}
    />
  );
}