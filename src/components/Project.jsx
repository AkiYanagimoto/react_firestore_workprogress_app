import React from 'react';
import firebase from '../firebase';

const Project = ({ index, project, getProjectsFromFirestore }) => {

    const deleteDataOnFirestore = async (collectionName, documentId) => {
        const removedData = await firebase.firestore()
            .collection(collectionName)
            .doc(documentId)
            .delete();
        getProjectsFromFirestore();
        return
    }

    const tdStyle = { padding: "4px", border: "1px solid #888", textAlign: "center" }

    return (
        // <li key={index} id={project.id}>
        //     <input type="checkbox" value={project.id} />
        //     <button value={project.id}>delete</button>
        //     <p>プロジェクト：{project.data.project}</p>
        //     <p>ステータス：{project.data.status}</p>
        //     <p>人時：{project.data.wh}</p>
        // </li>

        <tr key={index} id={project.id}>
            <td style={tdStyle}>
                <p>{project.data.project}</p>
            </td>
            <td style={tdStyle}>
                <p>{project.data.wh} &nbsp;WH</p>
            </td>
            {/* <td style={tdStyle}>
                <input type="checkbox" value={project.id} />
            </td> */}
            <td style={tdStyle}>
                <button
                    id="deleteBtn"
                    value={project.id}
                    onClick={e => deleteDataOnFirestore('projects', project.id)}
                >削除</button>
            </td>
        </tr>


    )
}
export default Project;