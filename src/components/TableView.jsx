import {useContext, useEffect, useRef, useState} from 'react';
import DataTable from 'react-data-table-component';
import PocketBaseContext from "./PocketBaseContext.js";
import {useNavigate} from "react-router-dom";
import UpdateForm from "./UpdateForm";

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
        name: '4Ps',
        selector: row => row.fourPs ? 'True' : 'False',
        sortable: true,
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
    const [selectedRow, setSelectedRow] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);

    const addRecord = (e) => {
        e.preventDefault();
        navigate('/form');
    }

    const printPage = (e) => {
        e.preventDefault();

        window.print();
    }

    const rowClicked = (row) => {
        console.log('Row Clicked: ',row);
        setSelectedRow(row);
        updateRecordFormModal.showModal();
    }

    const onRowSelection = ( row ) => {
        setSelectedRows(row.selectedRows);
    }

    const deleteRecords = (e) => {
        e.preventDefault();

        if (window.confirm('Are you sure you want to delete these records?')) {
            selectedRows.forEach(async item => {
                try {
                    await pb.collection('Parents').delete(item.id);
                } catch (err) {
                    console.log('Error encountered while deleting record.', err);
                }
            });
            alert('Record(s) has been deleted!');
            window.location.reload();
        }
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
                <div className="flex flex-row gap-4">
                    <button className="btn btn-info text-white no-print" onClick={addRecord}>Add Record</button>
                    <button className="btn btn-success text-white no-print" onClick={printPage}>Print Records</button>
                    { selectedRows.length > 0 && <button onClick={deleteRecords} className="btn btn-error text-white no-print">Delete Record(s)</button> }
                </div>
                <input
                    className="no-print"
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
                paginationComponentOptions={{selectAllRowsItem: true}}
                selectableRows
                onSelectedRowsChange={onRowSelection}
                onRowClicked={rowClicked}
            />
            <UpdateForm data={selectedRow} />
        </>
    );
}

export default TableView;