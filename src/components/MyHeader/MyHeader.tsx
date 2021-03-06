import React, { useCallback, useEffect, useState } from 'react';
import { Input, Layout, notification } from 'antd';
import './styles.css';
import Tab from '../Tab/Tab';
import ButtonPrimary from '../ButtonPrimary/ButtonPrimary';
import { rootColor } from '../../constants/rootColor';
import InputPrimary from '../InputPrimary/InputPrimary';
import { SearchOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import logoSecondary from '../../assets/images/logoSecondary.png';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import rootConfigtab from '../../constants/configTab';
import { Menu, Dropdown } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers/index';
import { useHistory } from 'react-router-dom';
import { logout } from '../../redux/actions/userAction';
import { transform } from 'typescript';
import { GameDetailss } from '../../interfaces/rootInterface';
import GameOnSale from '../Notification/GameOnSale';
import axios from 'axios';
import { Endpoint } from '../../api/endpoint';
import SearchBox from '../SearchBox/SearchBox';

const { Header } = Layout;

const tabs = rootConfigtab.HEADER_TABS;

interface MyHeaderPropstype {
  onOpen: () => void;
}

function MyHeader({ onOpen }: MyHeaderPropstype) {
  const [searchText, setSearchText] = useState('');
  const [scroll, setScroll] = useState('up');
  const screens = useBreakpoint();
  const history = useHistory();
  const dispatch = useDispatch();
  const currentTab = useSelector((state: RootState) => state.tab);
  const user = useSelector((state: RootState) => state.user);
  const { userName = '', idUser = '' } = user || {};
  const [onSearch, setOnSearch] = useState(false);
  const [textSearch, setTextSearch] = useState("");

  const onPressLogoHeader = () => {
    history.replace('/');
  };

  const renderMenu = useCallback(
    () => (
      <Menu style = {{width:'fit-content'}}>
        <Menu.Item>
          <Link to={'/user/' + user.userName}>
            <div className='flex-start'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                enable-background='new 0 0 24 24'
                height='20px'
                viewBox='0 0 24 24'
                width='20px'
                fill='#b5b5b5'>
                <g>
                  <path d='M0,0h24v24H0V0z' fill='none' />
                </g>
                <g>
                  <g>
                    <circle cx='10' cy='8' r='4' />
                    <path d='M10.67,13.02C10.45,13.01,10.23,13,10,13c-2.42,0-4.68,0.67-6.61,1.82C2.51,15.34,2,16.32,2,17.35V20h9.26 C10.47,18.87,10,17.49,10,16C10,14.93,10.25,13.93,10.67,13.02z' />
                    <path d='M20.75,16c0-0.22-0.03-0.42-0.06-0.63l1.14-1.01l-1-1.73l-1.45,0.49c-0.32-0.27-0.68-0.48-1.08-0.63L18,11h-2l-0.3,1.49 c-0.4,0.15-0.76,0.36-1.08,0.63l-1.45-0.49l-1,1.73l1.14,1.01c-0.03,0.21-0.06,0.41-0.06,0.63s0.03,0.42,0.06,0.63l-1.14,1.01 l1,1.73l1.45-0.49c0.32,0.27,0.68,0.48,1.08,0.63L16,21h2l0.3-1.49c0.4-0.15,0.76-0.36,1.08-0.63l1.45,0.49l1-1.73l-1.14-1.01 C20.72,16.42,20.75,16.22,20.75,16z M17,18c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S18.1,18,17,18z' />
                  </g>
                </g>
              </svg>
              &emsp; Account
            </div>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <div onClick={handleSignOut} className='flex-start'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='20px'
              viewBox='0 0 24 24'
              width='20px'
              fill='#b5b5b5'>
              <path d='M0 0h24v24H0z' fill='none' />
              <path d='M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z' />
            </svg>
            &emsp; Sign Out
          </div>
        </Menu.Item>
      </Menu>
    ),
    [user]
  );
  const scroll_detect = () =>{
    var lastScrollTop = 0;
    window.addEventListener("scroll", function(){
    var st = window.pageYOffset || document.documentElement.scrollTop; 
    if (st <= 0) setScroll('up'); else setScroll('down')
    }, false);
  }
  const handleSignOut = () => {
    localStorage.removeItem('accessToken');
    dispatch(logout());
    history.replace('/');
  };

  const onHandleSearch = value => {
    // handle searh here with value
    setSearchText(value);
  };
  const openNotification = (title:string,game:GameDetailss,placement) => {
    notification.open({
      message: `${title}`,
      duration: 10,
      style: {background:"#222222d7",borderRadius:"10px",color:"white"},
      description:
        <GameOnSale game = {game}></GameOnSale>,
      placement
    });
  };
  const getGameNotification = () => {
    axios.get(Endpoint.mainApi + 'api/suggestion/get-game-suggestion-now')
      .then(res => {
        openNotification("Game On Sale Now !!!",res.data,"bottomLeft");
      })

  }
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  useEffect(()=>{
    scroll_detect();
  })
  useEffect(()=>{

    if (user===null)
    setTimeout(getGameNotification,getRandomInt(10)*1000+10000)
  },[user])
  return (
    <Header className={`header${!screens.lg ? ' header--md' : ''}`} 
            style = {{
              background: scroll==='up'  ? '#131313' : '#111111' ,
              borderBottom: scroll==='up' ? '1px solid #1f1f1f' : '0px',
              transform: scroll==='down' && screens.lg ? 'translateY(-85px)' : 'translateY(0)'  
            }}>
      <div className='header__top-wrapper hide-on-md'>
        <div className='header__tabs header__top-wrapper--left'>
          {tabs.map((tab, index) => (
            <Link to={tab.linkTo}>
              <Tab
                key={`tab-${tab.name}`}
                text={tab.name}
                active={currentTab === tab.linkTo}
              />
            </Link>
          ))}
        </div>
        <div className='header__top-wrapper--right'>
          {idUser ? (
            <Dropdown overlay={renderMenu} placement='bottomCenter'>
              <div className='header__top-wrapper--right__user pointer'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  height='20px'
                  viewBox='0 0 24 24'
                  width='20px'
                  fill='#FFFFFF'>
                  <path d='M0 0h24v24H0z' fill='none' />
                  <path d='M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z' />
                </svg>
                &nbsp;&nbsp;
                {userName.toUpperCase()}
              </div>
            </Dropdown>
          ) : (
            <div className='header__top-wrapper--right__user gray-6'>
              {/* <Link
                to='/sign-up'
                className='m-0 global_action_link pointer sign_in_hover'>
                Sign Up
              </Link>
              &nbsp;|&nbsp; */}
              <Link
                to='/sign-in'
                className='m-0 global_action_link pointer sign_in_hover'>
                Sign In
              </Link>
            </div>
          )}
          {user?.roles === 'admin' ?
            <ButtonPrimary
            text='GO TO CONSOLE'
            callback={() => window.open('/admin/console/game-list')}
            containerColor={rootColor.redColor}
            borderColor={rootColor.redColor}
            styleClass={'header__top-wrapper--right__btn-get-launcher'}
          />
            :
            <ButtonPrimary
            text='GET LAUNCHER'
            callback={() => window.location.href = 'https://github.com/nguyenphuc1040/stun-launcher/releases/download/1.0.2/Stun.Setup.1.0.2.exe'}
            containerColor={rootColor.redColor}
            borderColor={rootColor.redColor}
            styleClass={'header__top-wrapper--right__btn-get-launcher'}
          />
          }
          
        </div>
      </div>

      <div className='header__bottom-wrapper' style = {{marginTop: scroll ==='down' && screens.lg ? '50px' : '0px'}}>
        <div
          className='header__bottom-wrapper__logo'
          onClick={onPressLogoHeader}>
          <img src={screens.lg ? logo : logoSecondary} alt='logo' />
        </div>
        <Input
          className='header__bottom-wrapper__input'
          placeholder='Search'
          onFocus={()=>{setOnSearch(true)}}
          // onBlur={()=>{setOnSearch(false)}}
          onChange={(event)=>{setTextSearch(event.target.value)}}
        />
          <div className='header__bottom-wrapper__wish-list' >
            {screens.lg ? (
              <div>
                {
                  user !== null ?
                  <Link to={'/wishlist/'+user.userName}><a>Wish list</a></Link>
                  :null
                }
              </div>
            ) : (
              <button className='header__drawer-btn' onClick={()=>onOpen()}>
                <MenuOutlined className='header__drawer-btn__icon' />
              </button>
            )}
            {/* WishList */}
          </div> 
      </div>
      <div
        onClick={()=>{setOnSearch(false)}} 
        className = "search-box-modal"
        style={{
          display:onSearch ? "flex" : "none",
          transform: scroll==='down' && screens.lg ? 'translateY(45px)' : 'translateY(0)'  
          }}> 
        <SearchBox text={textSearch}/>
      </div>
      <div className='header_button-scroll-top' onClick={()=>{window.scrollTo(0,0)}}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ababab"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
      </div>
    </Header>
  );
}

export default MyHeader;
