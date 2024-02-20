import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment'
import AuthContext from '../context/AuthContext';
import PreContext from '../context/PreContext';
const IdleTimeOutHandler = (props) => {
    let { idletime } = useContext(PreContext);
    const [data, setData] = useState({})
    let user_idle_time = ''
    let timer = undefined;
    const events = ['click', 'scroll', 'load', 'keydown', 'mousemove']
    const eventHandler = (eventType) => {

        // console.log(eventType)
        localStorage.setItem('lastInteractionTime', moment())
        if (timer) {
            props.onActive();
            startTimer();
        }
    };


    useEffect(() => {
        addEvents();

        return (() => {

            removeEvents();
        })
    }, [idletime])

    const startTimer = () => {
        // const defaulttimeout = 1000*60*30 // 1000*60*60->one hour
        const defaulttimeout = idletime && idletime.idle_time ? 1000 * 60 * Number(idletime.idle_time) : 1000 * 60 * 30
        timer = setTimeout(() => {
            let lastInteractionTime = localStorage.getItem('lastInteractionTime')
            const diff = moment.duration(moment().diff(moment(lastInteractionTime)));
            let timeOutInterval = props.timeOutInterval ? props.timeOutInterval : defaulttimeout;

            if (diff._milliseconds < timeOutInterval) {
                startTimer();
                props.onActive();
            } else {
                props.onIdle();
            }
        }, props.timeOutInterval ? props.timeOutInterval : defaulttimeout)


    }
    const addEvents = () => {

        events.forEach(eventName => {
            window.addEventListener(eventName, eventHandler)
        })

        startTimer();
    }

    const removeEvents = () => {
        events.forEach(eventName => {
            window.removeEventListener(eventName, eventHandler)
        })
    };

    return (
        <div></div>
    )

}

export default IdleTimeOutHandler;