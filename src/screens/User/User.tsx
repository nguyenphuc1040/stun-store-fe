import React, { useEffect, useState } from 'react';
import './styles.css';
import ProfileUserLayout from '../../layout/ProfileUserLayout/ProfileUserLayout';
import CollectionLayout from '../../layout/CollectionLayout/CollectionLayout';
import getCollectionByUserApi from '../../api/collectionApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { CollectionType, GameType } from '../../interfaces/rootInterface';

function User() {
  const [collection, setCollection] = useState<CollectionType[]>([]);
  const user = useSelector((state: RootState) => state.user);

  const removeGameFromCollection = (idGame: string) => {
    const newCollection = collection.filter(
      item => item.game.idGame.localeCompare(idGame) != 0
    );
    setCollection([...newCollection]);
  };

  const fetchCollection = async idUser => {
    console.log('fetch collection');
    const res = await getCollectionByUserApi(idUser);
    const { listGame } = res || {};

    if (listGame) {
      setCollection(listGame);
    }
  };

  useEffect(() => {
    fetchCollection(user.idUser);
  }, []);

  return (
    <div className='relative min-height-inherit'>
      <div className='min-height-inherit d-flex column'>
        <div className='min-height-inherit min-width-0 d-flex column'>
          <div className='min-height-inherit d-flex column relative'>
            <ProfileUserLayout user={user} />
            {collection.length === 0 ? (
              <div>loadding.....</div>
            ) : (
              <CollectionLayout
                removeGameFromCollection={removeGameFromCollection}
                user={user}
                collection={collection}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
