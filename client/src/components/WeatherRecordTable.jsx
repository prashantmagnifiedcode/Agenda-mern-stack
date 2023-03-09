import React,{useState} from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
const MyTable=({weatherData}) =>{
 
  const pages = [10 ]
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(pages[page])
  const [order, setOrder] = useState()
  const [orderBy, setOrderBy] = useState()
  const handleChangePage = (event, newPage) => {
    
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log("rowperpage",page)
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0);
  };
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}
  const recordsAfterPagingAndSorting = () => {
    return stableSort(weatherData, getComparator(order, orderBy))
        .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
}

  return (
    <>
    <div className='overflow-x-scroll'>
       <TableContainer component={Paper}  >
      <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table" className="w-full ">
        <TableHead>
          <TableRow  className="font-bold  bg-indigo-300" >
          
            <TableCell  style={{fontSize:"12px",fontWeight:"520",color:"white",letterSpacing:"2px"}}> CityName </TableCell>
            <TableCell align="center" style={{fontSize:"12px",fontWeight:"520",color:"white",letterSpacing:"2px"}} >Temperature</TableCell>
            <TableCell align="center" style={{fontSize:"12px",fontWeight:"520",color:"white",letterSpacing:"2px"}}>Humidity</TableCell>
            <TableCell align="center" style={{fontSize:"12px",fontWeight:"520",color:"white",letterSpacing:"2px"}}>Weather</TableCell>
            {/* <TableCell align="center">Main</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody >
{
  recordsAfterPagingAndSorting().map((e,idx)=>{
    return(
      <>
      
        <TableRow  className="font-bold  " key={idx}>
          
          <TableCell  >{e.name} </TableCell>
          <TableCell align="center" className="text-slate-100" > <DeviceThermostatIcon style={{color:"skyblue",fontSize:"12px"}}/>{e.main.temp} Clesius </TableCell>
          <TableCell align="center"  className="text-slate-100" > {e.main.humidity} </TableCell>
          <TableCell align="center"  className="text-slate-100" >{e.weather[0].description} </TableCell>
          </TableRow>
      </>
    )
  })
}
         </TableBody>
         </Table>
         </TableContainer>
      <TablePagination
         component="div"
         className="bg-indigo-300 overflow-x-scroll"
         page={page}
         rowsPerPage={rowsPerPage}
         rowsPerPageOptions={pages}
        count={weatherData.length}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        
      />
         </div>
    </>
  );
}

export default MyTable







