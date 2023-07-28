import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import {TextField} from "@mui/material";
import {useParams} from "react-router-dom";
import {getColor, updateColor} from "../apis/colors";
import Toaster from "./Toaster";
import {Delete} from "@mui/icons-material";
import Typography from "@material-ui/core/Typography";

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
    detailsBtn: {
        backgroundColor: "#B21F18",
        color: "white",
        fontFamily: "Inter",
        padding: "10px",
        '&:disabled': {
            opacity: 0.6,
            pointerEvents: 'none',
        },
    }
}));

function ColorsListComponent({}) {

    const classes = useStyles();

    const [state, setState] = useState({
        toasterColor: "success",
        toasterMessage: ``,
        colorsNumber: 0,
        data: [],
        title: ""
    })

    const {id} = useParams()


    useEffect(() => {

        const anonymousFunction = async () => {
            try {
                const details = await getColor(id)

                if (details && details.success) {
                    setState({
                        ...state,
                        title: details && details.data?.title ? details.data.title : null,
                        data: details && details.data?.colorVariants ? details.data.colorVariants : [],
                        colorsNumber: details && details.data?.colorNumbers ? details.data.colorNumbers : 0,
                    })

                } else {
                    setState({
                        ...state,
                        toasterColor: "error",
                        toasterMessage: `Error while fetching details`
                    });
                }


            } catch (e) {
                setState({
                    ...state,
                    toasterColor: "error",
                    toasterMessage: `Error while fetching details`
                });
                console.log('error while fetching record', e.message)
            }
        }

        anonymousFunction()


    }, [])

    const checkBtnDisabled = () => {
        const {data} = state

        let disable = false

        data.forEach(el => {
            if (!el.color) {
                disable = true
            }

            if (el && Object.keys(el.variants).length > 0) {
                Object.keys(el.variants).forEach(e => {
                    if (!el.variants[e]) {
                        disable = true
                    }
                })
            }

        })

        return disable
    }

    const submitForm = async () => {

        try {

            const data = {
                colorVariants: state.data,
                colorNumbers: state.colorsNumber
            }

            const res = await updateColor(id, data)

            if (res && res.success) {
                setState({
                    ...state,
                    toasterColor: "success",
                    toasterMessage: `Color Updated Successfully`,
                });

            } else {
                setState({
                    ...state,
                    toasterColor: "error",
                    toasterMessage: `Error while updating data`,
                });
            }

        } catch (e) {
            setState({
                ...state,
                toasterColor: "error",
                toasterMessage: `Error while updating data`
            });
            console.log('error while updating data', e.message)
        }
    }

    const removeToaster = () => {
        setState({...state, toasterColor: 'success', toasterMessage: ""})
    }

    const addVariant = () => {

        const updatedArray = state.data.map((el) => {
            return {...el, variants: {...el.variants, 0: ""}};
        });
        setState({...state, data: updatedArray});

    };

    const deleteVariant = (variant) => {

        const dataArray = JSON.parse(JSON.stringify(state.data))

        dataArray.forEach((el) => {
            delete el['variants'][variant]
        });

        setState({...state, data: dataArray});
    }

    return (

        <div className={classes.root}>

            <Grid container spacing={2} className={classes.textStyling}>
                <Grid item>
                    <Typography variant="h4" component="h4" gutterBottom
                                style={{
                                    fontSize: "35px",
                                    lineHeight: "48px",
                                    fontWeight: 600,
                                    color: "#B21F18"
                                }}>
                        {state.title}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container>
                <TextField
                    type={'number'}
                    style={{marginBottom: "10px"}}
                    inputProps={{
                        min: 0,
                    }}
                    onChange={(e) => {

                        const value = e.target.value ? parseInt(e.target.value) : 0

                        const stateColors = JSON.parse(JSON.stringify(state.data))

                        if (value > state.colorsNumber) {

                            let arr = []

                            for (let i = 0; i < value - state.colorsNumber; i++) {

                                if (state.data && state.data.length > 0) {
                                    let dataObj = {...state.data[0]}

                                    dataObj = {...dataObj, color: ""}

                                    Object.keys(dataObj.variants).forEach(el => {
                                        dataObj.variants[el] = ""
                                    })

                                    arr.push(dataObj);

                                } else {
                                    arr.push({color: "", variants: {0: ""}});
                                }

                            }

                            setState({
                                ...state,
                                data: stateColors.concat(arr),
                                colorsNumber: value,
                            })

                        } else if (value < state.colorsNumber) {

                            const newArr = stateColors.splice(0, value)

                            setState({
                                ...state,
                                data: newArr,
                                colorsNumber: value
                            })

                        } else {
                            console.log('nothing to work')
                        }


                    }}
                    fullWidth
                    value={state.colorsNumber}/>
            </Grid>

            <Grid container spacing={2}>
                <Grid item style={{width: state.data && state.data.length <= 2 ? "80%" : "100%"}}>
                    <div
                        style={{
                            display: "flex",
                            width: "100%"
                        }}>
                        {state.data.map((item, idx) => {
                            return (
                                <div>

                                    <div style={{display: "flex", justifyContent: "end"}}>
                                        <TextField value={item?.color}
                                                   onChange={(e) => {

                                                       const data = JSON.parse(JSON.stringify(state.data))

                                                       data[idx]['color'] = e.target.value

                                                       setState({...state, data})

                                                   }}
                                                   style={{width: "100px", margin: "3px"}}
                                                   placeholder="Color"/>
                                    </div>


                                    <div>
                                        {Object.keys(item.variants).map((variant) => {
                                            if (idx === 0) {
                                                return (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between"
                                                        }}
                                                    >

                                                        <IconButton
                                                            aria-label="share"
                                                            style={{padding: "0px"}}
                                                            onClick={() => deleteVariant(variant)}>
                                                            <Delete size={30}/>
                                                        </IconButton>


                                                        <TextField
                                                            style={{width: "50px", margin: "3px"}}
                                                            value={variant}
                                                            placeholder="Variant"
                                                            onChange={(e) => {

                                                                const dataArray = JSON.parse(JSON.stringify(state.data))

                                                                if (variant !== e.target.value && item.variants.hasOwnProperty(variant) && !item.variants.hasOwnProperty(e.target.value)) {

                                                                    dataArray.forEach(data => {
                                                                        const updatedData = {...data};
                                                                        updatedData['variants'][e.target.value] = updatedData['variants'][variant];
                                                                        delete updatedData['variants'][variant];
                                                                    })

                                                                    setState({...state, data: dataArray})

                                                                }

                                                            }}
                                                        />

                                                        <TextField
                                                            style={{width: "100px", margin: "3px"}}
                                                            value={item.variants[variant]}
                                                            onChange={e => {
                                                                const dataArray = JSON.parse(JSON.stringify(state.data))
                                                                dataArray[idx]['variants'][variant] = e.target.value

                                                                setState({...state, data: dataArray})
                                                            }}
                                                            placeholder="shade"/>

                                                    </div>
                                                );
                                            } else {
                                                return (

                                                    <div style={{display: "flex", justifyContent: "end"}}>
                                                        <TextField
                                                            onChange={e => {
                                                                const dataArray = JSON.parse(JSON.stringify(state.data))
                                                                dataArray[idx]['variants'][variant] = e.target.value

                                                                setState({...state, data: dataArray})
                                                            }}
                                                            value={item.variants[variant]}
                                                            style={{width: "100px", margin: "3px"}}
                                                            placeholder="Shade"/>
                                                    </div>

                                                );
                                            }
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Grid>

            </Grid>

            <Grid container spacing={2}>

                <Grid item>
                    <IconButton
                        aria-label="share"
                        style={{padding: "0px"}}
                        onClick={() => addVariant()}>
                        <AddBoxIcon size={30}/>
                    </IconButton>

                </Grid>

            </Grid>

            <Grid container spacing={2}>

                <Grid item>
                    <Button
                        onClick={submitForm}
                        variant="contained"
                        color="primary"
                        disabled={checkBtnDisabled()}
                        className={classes.detailsBtn}
                        style={{color: "white", backgroundColor: "#B21F18"}}>
                        Update
                    </Button>
                </Grid>

            </Grid>


            {state.toasterMessage &&
                <Toaster message={state.toasterMessage} removeToaster={removeToaster} severity={state.toasterColor}/>}
        </div>
    );
}

export default ColorsListComponent;