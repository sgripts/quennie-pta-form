import {useContext, useEffect, useRef, useState} from 'react';
import DataTable from 'react-data-table-component';
import PocketBaseContext from "./PocketBaseContext.js";
import {useNavigate} from "react-router-dom";

const columns = [
    {
        name: 'First Name',
        selector: row => row.firstName,
        sortable: true,
    },
    {
        name: 'Last Name',
        selector: row => row.lastName,
        sortable: true,
    },
    {
        name: '4Ps Member',
        selector: row => row.fourPs ? 'True' : 'False',
    },
    {
        name: 'Child Grade Levels',
        selector: (row, index) => {
            return row.expand.GradeLevels.map((level, index) => index === row.expand.GradeLevels.length - 1 ? level.Name : level.Name + ', ');
        },
        sortable: true,
    },
]

const customStyles = {
    headCells: {
        style: {
            fontWeight: '700',
        }
    },
}


const TableView = () => {
    const { pb } = useContext(PocketBaseContext);
    const navigate = useNavigate();
    const [allRecords, setAllRecords] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const addRecord = (e) => {
        e.preventDefault();
        navigate('/form');
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await pb.collection('Parents').getFullList({
                    expand: 'GradeLevels',
                    requestKey: null,
                });

                setAllRecords(result);
                setFilteredData(result)
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [pb]);

    useEffect( () => {
        const filteredItems = allRecords.filter(item => {
            const gradeLevels = item.expand?.GradeLevels
                ? item.expand.GradeLevels.map(level => level.Name).join(' ')
                : '';

            // Combine all searchable fields, including GradeLevels
            const combinedData = Object.values(item).join(' ') + ' ' + gradeLevels;

            return combinedData.toLowerCase().includes(filterText.toLowerCase());
        });
        setFilteredData(filteredItems);

    },[filterText, allRecords]);


    return (
        <>
            <div className="flex w-full flex-row justify-between">
                <button className="btn btn-info" onClick={addRecord}>Add Record</button>
                <input
                    type="text"
                    placeholder="Search"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                    style={{marginBottom: '10px', padding: '5px', width: '200px'}}
                />
            </div>

            <DataTable
                columns={columns}
                data={filteredData}
                customStyles={customStyles}
                pagination
            />
        </>
    );
}

export default TableView;