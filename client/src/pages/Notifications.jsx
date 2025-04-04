import React from 'react'
import Layout from '../components/Layout.jsx'
import { Tabs} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setUser } from '../redux/userSlice.js';

function Notifications() {
  const {user} = useSelector((state)=>state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const markAllAsSeen = async ()=>{
    try {
      dispatch(showLoading())
    const response = await axios.post('http://localhost:5000/api/user/mark-all-notifications-as-seen',{userId:user._id},
      {
        headers:{
          Authorization:'Bearer ' + localStorage.getItem('token')
        }
      }
    );
    dispatch(hideLoading())
    if (response.data.success)
    {
      toast.success(response.data.message);
      
      dispatch(setUser(response.data.data))
    } 
    else{
      toast.error(response.data.message);
    } 
  } catch (error) {
    dispatch(hideLoading())
    console.log(error.message)
  }


  }

  const deleteAll = async ()=>{
    try {
      dispatch(showLoading())
    const response = await axios.delete('http://localhost:5000/api/user/delete-all-notifications',
      {
        headers:{
          Authorization:'Bearer '+ localStorage.getItem('token')
        }
      }
    );
    dispatch(hideLoading())
    if (response.data.success)
    {
      toast.success(response.data.message);
      
      dispatch(setUser(response.data.data))
    } 
    else{
      toast.error(response.data.message);
    } 
  } catch (error) {
    dispatch(hideLoading())
    console.log(error)
  }


  }

  const items = [
    {
      key: '1',
      label: 'Unseen',
      children: <>
      <div className="d-flex justify-content-end">
        <h1 className='anchor' onClick={markAllAsSeen} >Mark all as seen</h1>
      </div>
        {user?.unseenNotifications?.map((notification)=>(
          <div className='card p-2' onClick={()=>navigate(notification.onClickPath)} >
            <div className='card-text' >{notification.message}</div>
          </div>
        ))}
      </> ,
    },
    {
      key: '2',
      label: 'Seen',
      children: <>
      <div className="d-flex justify-content-end">
        <h1 className='anchor' onClick={deleteAll} >Delete All</h1>
      </div>
      {user?.seenNotifications?.map((notification)=>(
          <div className='card p-2' onClick={()=>navigate(notification.onClickPath)} >
            <div className='card-text' >{notification.message}</div>
          </div>
        ))}
      </>,
    },
    
  ];
  return (
    <Layout>
      <h1 className="page">Notifications</h1>
      <Tabs defaultActiveKey="1" items={items}  />
    </Layout>
  )
}

export default Notifications