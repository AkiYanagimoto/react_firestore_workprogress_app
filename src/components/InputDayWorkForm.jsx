import React, { useState, useEffect } from 'react';
import firebase from '../firebase';

const InputDayWorkForm = ({ getDayWorkFromFirestore }) => {

    // 登録済みタスクリストをFirestoreから取得
    const [taskList, setTaskList] = useState(null);

    const getTaskFromFirestore = async () => {
        const taskListArray = await firebase.firestore()
            .collection('tasks')
            .get();

        const taskArray = await taskListArray.docs.map(x => {
            return {
                id: x.id,
                data: x.data(),
            }
        })

        // const taskArray = await Promise.all(taskListArray.docs.map(async (x) => {
        // TaskIdを取得
        // let projectRef = x.data().projectRef;
        // // console.log(projectRef);

        // const projectDetail = await firebase.firestore()
        //     .doc(projectRef)
        //     .get();

        // return {
        //     id: x.id,
        //     data: x.data(),
        //     projectDetail: projectDetail.data(),
        // }
        // }))

        setTaskList(taskArray)
        return taskArray;
    }

    useEffect(() => {
        const result = getTaskFromFirestore();
    }, [])

    // console.log(taskList);

    let getdate = new Date();
    let yymmdd = getdate.getFullYear()
        + '/' + ('0' + (getdate.getMonth() + 1)).slice(-2)
        + '/' + ('0' + getdate.getDate()).slice(-2)

    const [date, setDate] = useState(yymmdd);
    const [priority, setPriority] = useState('1');
    const [status, setStatus] = useState('');
    const [whActual, setWhActual] = useState('');
    const [whEstimate, setWhEstimate] = useState('');
    // const [projectRef, setProjectRef] = useState('');
    const [taskRef, setTaskRef] = useState('タスクを選ぶ');

    // Firestoreにデータを送信する関数
    const postDataToFirestore = async (collectionName, postData) => {

        const addedData = await firebase.firestore()
            .collection(collectionName)
            .add(postData);

        return addedData;
    }

    const createData = async () => {
        if (date === '' || priority === '' || whEstimate === '' || taskRef === '') { return false };

        const postData = {

            date: date,
            priority: priority,
            status: true,
            whActual: 0,
            whEstimate: Number(whEstimate),
            // taskをreference型で登録する
            taskRef: firebase.firestore().doc('tasks/' + taskRef),
        }

        // console.log(postData);
        const addedData = await postDataToFirestore('day_work', postData);
        setDate(yymmdd);
        setPriority('');
        setWhEstimate('');
        setTaskRef('タスクを選ぶ');
        getDayWorkFromFirestore();
    }

    return (
        <form action="">
            <ul>
                <li>
                    <label htmlFor="date">日付</label>
                    <input
                        type="text"
                        id="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                </li>
                <li>
                    <label htmlFor="taskRef">取組むタスク</label>
                    <select id="taskRef"
                        onChange={e =>
                            setTaskRef(e.target.value)}
                    >
                        {
                            taskList?.map((x, index) =>
                                <option
                                    key={index}
                                    id="taskRef"
                                    value={x.id}
                                >
                                    {x.data.task}
                                </option>
                            )
                        }
                    </select>
                </li>
                <li>
                    <label htmlFor="priority">作業の優先度</label>
                    <input
                        type="number"
                        id="priority"
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                    />
                </li>
                <li>
                    <label htmlFor="whEstimate">今日の作業予定時間</label>
                    <input
                        type="number"
                        id="whEstimate"
                        value={whEstimate}
                        onChange={e => setWhEstimate(e.target.value)}
                    />
                </li>
                <li>
                    <button
                        type="button"
                        onClick={createData}
                    >今日の作業として登録</button>
                </li>
            </ul>
        </form>
    )
}
export default InputDayWorkForm;