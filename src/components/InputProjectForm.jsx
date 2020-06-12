import React, { useState } from 'react';
import firebase from '../firebase';

const InputProjectForm = ({ getProjectsFromFirestore }) => {
    const [project, setProject] = useState('');
    // const [color, setColor] = useState('');
    // const [status, setStatus] = useState('');
    // const [wh, setWh] = useState('0');
    // const [user, setUser] = useState('');

    // firestoreにデータを送信する関数
    const postDataToFirestore = async (collectionName, postData) => {
        const addedData = await firebase.firestore().collection(collectionName).add(postData);
        return addedData;
    }

    // submitボタンクリック時の処理
    const submitData = async () => {
        if (project === '') { return false };
        const postData = {
            project: project,
            // color: color,
            status: 0,
            wh: 0,
            // user: user,
        }
        const addedData = await postDataToFirestore('projects', postData);
        setProject('');
        // setColor('');
        // setStatus('');
        // setWh('0');
        // setUser('');
        getProjectsFromFirestore();
    }

    return (
        <div>
            <h3>プロジェクト新規登録</h3>
            <form action="">
                <ul>
                    <li>
                        <label htmlFor="project">プロジェクト</label>
                        <input
                            type="text"
                            id="project"
                            value={project}
                            onChange={e => setProject(e.target.value)}
                        />
                    </li>
                    {/* <li>
                        <label htmlFor="color">カラー</label>
                        <input
                            type="number"
                            id="color"
                            value={color}
                            onChange={e => setColor(e.target.value)}
                        />
                    </li> */}
                    {/* <li>
                        <label htmlFor="status">ステータス</label>
                        <input
                            type="number"
                            id="status"
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        />
                    </li> */}
                    {/* <li>
                        <label htmlFor="wh">人時</label>
                        <input
                            type="number"
                            id="wh"
                            value="0"
                            onChange={e => setWh(e.target.value)}
                        />
                    </li> */}
                    <li>
                        <button
                            type="button"
                            onClick={submitData}
                        >Submit</button>
                    </li>
                </ul>
            </form>
        </div>
    )

}
export default InputProjectForm;