import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import InputDayWorkForm from './InputDayWorkForm';
import DayWork from './DayWork';

let date = new Date();
let yymmdd = date.getFullYear()
    + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
    + '/' + ('0' + date.getDate()).slice(-2)

const DayWorkList = props => {

    const [dayWorkList, setDayWorkList] = useState(null);

    // 一日の作業リストを取得してstateに格納
    const getDayWorkFromFirestore = async () => {
        const dayWorkListArray = await firebase.firestore()
            .collection('day_work')
            .where('date', '==', yymmdd)
            .orderBy('priority')
            .get();

        // const dayWorkArray = await dayWorkListArray.docs.map(x => {
        //     return {
        //         id: x.id,
        //         data: x.data(),
        //         date: x.data().date,
        //     }
        // })

        // 各作業リストに紐づけられたタスクを取得
        const dayWorkArray = await Promise.all(dayWorkListArray.docs.map(async (x) => {
            // タスクのIDを取得
            let taskId = x.data().taskRef.id;

            // IDでfirestoreからドキュメントを取得
            const taskDetail = await firebase.firestore()
                .collection('tasks')
                .doc(taskId)
                .get();


            // // プロジェクトIDを取得
            // let projectId = x.data().project.id;

            // // IDでfirestoreからドキュメントを取得
            // const projectDetail = await firebase.firestore()
            //     .collection('projects')
            //     .doc(projectId)
            //     .get();

            return {
                id: x.id,
                data: x.data(),
                date: x.data().date,
                taskDetail: taskDetail.data(),
                // projectDetail: projectDetail.data(),
            }
        }))

        setDayWorkList(dayWorkArray);
        return dayWorkArray;
    }

    // useEffectはレンダリングの後の動作を指示できる。
    // 第二引数が与えられているので、[props]が変わる度に動作する。
    useEffect(() => {
        const result = getDayWorkFromFirestore()
    }, [props])
    // console.log(dayWorkList);

    return (
        <div>
            <h2>タスク</h2>
            <h3>新規登録</h3>
            <InputDayWorkForm
                getDayWorkFromFirestore={getDayWorkFromFirestore}
            />

            <h3>タスクリスト&nbsp;【{yymmdd}】</h3>
            <ul>
                {
                    dayWorkList === null
                        ? <p>no data...</p>
                        : dayWorkList.map((x, index) =>
                            <DayWork
                                key={index}
                                dayWork={x}
                                index={index}
                                getDayWorkFromFirestore={getDayWorkFromFirestore}
                            />
                        )
                }
            </ul>
        </div>
    );
}
export default DayWorkList;