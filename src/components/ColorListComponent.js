import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom";
import AddColor from "./AddColor";
import {getAllColors} from "../apis/colors";
import Toaster from "./Toaster";
import {useNavigate} from "react-router-dom";
import {Select, MenuItem, CircularProgress, Pagination, PaginationItem} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(4),
        },
        [theme.breakpoints.up('md')]: {
            marginTop: theme.spacing(8),
            marginBottom: theme.spacing(8),
        },
    },
    card: {
        marginBottom: theme.spacing(2),
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 200,
        objectFit: 'cover',
    },
    textStyling: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: theme.spacing(3)
    },
    detailsBtn: {
        fontSize: "16px",
        backgroundColor: "#1D242A",
        color: "white",
        lineHeight: "24px",
        fontWeight: 550,
        fontFamily: "Inter",
        borderRadius: 0,
        padding: "10px",
        '&:hover': {
            border: "1px solid #1D242A",
            backgroundColor: "white",
            color: "#1D242A"
        },
    }
}));

function ColorsListComponent({}) {

    const classes = useStyles();

    const [state, setState] = useState({
        colors: [],
        toasterColor: "success",
        toasterMessage: ``,
        modalOpen: false,
        page: 0,
        count: 0,
        userType: 'Admin',
        loading: false
    })

    const getColors = async (page) => {

        try {

            setState({...state, loading: true})

            const colorsList = await getAllColors(page)

            if (colorsList && colorsList.success) {

                setState({
                    ...state,
                    colors: colorsList && colorsList.data && colorsList.data.colors ? colorsList.data.colors : [],
                    count: colorsList && colorsList.data && colorsList.data.count ? colorsList.data.count : 0,
                    modalOpen: false,
                    page,
                    loading: false
                })
            } else {

                setState({
                    ...state,
                    toasterColor: "error",
                    toasterMessage: `Error while fetching records`,
                    loading: false
                })
            }


        } catch (e) {

            setState({
                ...state,
                toasterColor: "error",
                toasterMessage: `Error while fetching records`,
                loading: false
            })
            console.log('error while fetching colors list', e.message)
        }
    }

    useEffect(() => {

        getColors(0)


    }, [])

    const handleChangePage = async (event, page) => {

        try {
            getColors(page-1)
            window.scrollTo(0, 0)
        } catch (e) {
            console.log(e.message)
        }
    }

    const navigate = useNavigate()
    const removeToaster = () => {
        setState({...state, toasterColor: 'success', toasterMessage: ""})
    }
    const closeModal = async (callApi = false) => {

        try {

            if (callApi) {

                getColors(state.page)

            } else {
                setState({
                    ...state,
                    modalOpen: false,
                })
            }


        } catch (e) {
            console.log('error while fetching list', e.message)
        }
    }

    return (
        <div className={classes.root}>

            <Grid container spacing={2}
                  style={{display: "flex", justifyContent: "end", alignItems: "end", marginBottom: "20px"}}>
                <Grid item>
                    <Select
                        sx={{width: "100%", height: "40px"}}
                        placeholder={'Select User Type'}
                        value={state.userType}
                        onChange={e => {
                            setState({...state, userType: e.target.value})
                        }}
                    >
                        {[{label: "Admin", value: "Admin"},
                            {label: "User", value: "User"},
                        ].map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
            </Grid>

            <Grid container spacing={2} className={classes.textStyling}>
                <Grid item>
                    <Typography variant="h4" component="h4" color={"#B21F18"} gutterBottom
                                style={{
                                    fontSize: "45px",
                                    lineHeight: "48px",
                                    fontWeight: 600,
                                }}>
                        {"Colors List"}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2}
                  style={{display: "flex", justifyContent: "end", alignItems: "end", marginBottom: "20px"}}>
                <Grid item>
                    <Button variant="contained"
                            disableRipple
                            style={{textTransform: "none"}}
                            onClick={(e) => setState({...state, mode: "add", modalOpen: !state.modalOpen})}>
                        Create Record
                    </Button>
                </Grid>
            </Grid>

            <Grid container spacing={2}>

                {(state.colors && state.colors.length > 0 && !state.loading) ? state.colors.map((item, index) => (
                    <Grid item xs={12} sm={3} key={index}>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom
                                            style={{
                                                fontSize: "18px",
                                                color: "#1D242A",
                                                lineHeight: "20px",
                                                fontWeight: 500,
                                                fontFamily: "Inter",
                                                marginBottom: "30px",
                                            }}
                                >
                                    {item.title && item.title.length > 20 ? item.title.substring(0, 20) + " ....." : item.title}
                                </Typography>
                                <Button className={classes.detailsBtn} color="primary" fullWidth component={Link}
                                        onClick={(e) => {
                                            if (state.userType === 'Admin') {
                                                navigate(`/admin/details/${item._id}`)
                                            } else {
                                                navigate(`/user/details/${item._id}`)
                                            }


                                        }}
                                >
                                    View Details
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                )) : !!state.loading ? (
                        <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <CircularProgress/>
                        </div>) :
                    (<div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Typography color="textSecondary" gutterBottom textAlign={'center'}>
                            No Content To show
                        </Typography>
                    </div>)

                }
            </Grid>

            {state.toasterMessage &&
                <Toaster message={state.toasterMessage} removeToaster={removeToaster} severity={state.toasterColor}/>}

            <AddColor
                isOpen={state.modalOpen}
                closeModal={closeModal}
            />

            <Grid container spacing={2}>
                <Grid item md={1}></Grid>
                <Grid item xs={10} style={{display: "flex", justifyContent: "center"}}>

                    <Pagination
                        count={Math.ceil(state.count / 10)}
                        onChange={handleChangePage}
                        renderItem={(item) => (
                            <PaginationItem
                                slots={{previous: ArrowBackIcon, next: ArrowForwardIcon}}
                                {...item}
                            />
                        )}
                    />
                </Grid>
                <Grid item md={1}></Grid>
            </Grid>


        </div>
    );
}

export default ColorsListComponent;