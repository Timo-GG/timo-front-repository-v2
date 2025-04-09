/** 모스트 챔피언 단일 설정 */

import React, { useEffect, useState } from 'react';
import { getChampionImageUrl } from '../../utils/championUtils';

export default function ChampionIcon({ championId }) {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    const fetchImg = async () => {
      const url = await getChampionImageUrl(championId);
      setImgUrl(url);
    };
    fetchImg();
  }, [championId]);

  if (!imgUrl) return null;

  return <img src={imgUrl} alt="champion" style={{ width: 32, height: 32, borderRadius: 4 }} />;
}