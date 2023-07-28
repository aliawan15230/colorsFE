import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {TextField} from "@mui/material";
import {useParams} from "react-router-dom";
import {getColor} from "../apis/colors";
import Toaster from "./Toaster";

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

function ColorDetailsUser({}) {

    const classes = useStyles();

    const [state, setState] = useState({
        toasterColor: "success",
        toasterMessage: ``,
        colorsNumber: 0,
        data: [],
        title: "",
        cart: 0,
        cartDocument: []
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
        const {cartDocument} = state

        return !(Array.isArray(cartDocument) && cartDocument.length > 0)
    }

    const setSelected = (color, variant) => {

        const dataArray = JSON.parse(JSON.stringify(state.data))

        let cart = state.cart

        let cartDoc = JSON.parse(JSON.stringify(state.cartDocument))

        dataArray.forEach(el => {

            if (!!el.color && color && el.color === color) {

                if (el['variants'][variant].includes("(selected)")) {

                    el['variants'][variant] = el['variants'][variant].replace(" (selected)", "");

                    cart = cart - 1

                    cartDoc = cartDoc.filter(doc => {

                        return doc.color !== color && doc[variant] !== el['variants'][variant]
                    })

                } else {
                    cartDoc = [...cartDoc, {color, [variant]: el['variants'][variant]}]
                    el['variants'][variant] = el['variants'][variant] + ' (selected)'
                    cart = cart + 1
                }

            }
        })


        setState({...state, data: dataArray, cart: cart, cartDocument: cartDoc})

    }

    const removeToaster = () => {
        setState({...state, toasterColor: 'success', toasterMessage: ""})
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
                    style={{marginBottom: "10px", pointerEvents: "none"}}
                    inputProps={{
                        min: 0,
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
                                <div style={{flex: 1}}>

                                    <h3 style={{textAlign: "right"}}>
                                        {item?.color}
                                    </h3>

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
                                                        <div>{variant}</div>

                                                        <p
                                                            style={{
                                                                textAlign: "right",
                                                                margin: 0,
                                                                cursor: 'pointer',
                                                                color: item['variants'][variant].includes("(selected)") ? "#B21F18" : "black",
                                                                fontWeight: item['variants'][variant].includes("(selected)") ? "bolder" : "normal"

                                                            }}
                                                            onClick={() => {

                                                                setSelected(item.color, variant)

                                                            }}
                                                        >
                                                            {item.variants[variant]}
                                                        </p>
                                                    </div>
                                                );
                                            } else {
                                                return (

                                                    <p
                                                        style={{
                                                            textAlign: "right",
                                                            margin: 0,
                                                            cursor: 'pointer',
                                                            color: item['variants'][variant].includes("(selected)") ? "#B21F18" : "black",
                                                            fontWeight: item['variants'][variant].includes("(selected)") ? "bolder" : "normal"
                                                        }}
                                                        onClick={() => {

                                                            setSelected(item.color, variant)

                                                        }}
                                                    >
                                                        {item.variants[variant]}
                                                    </p>
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
                    <Button
                        onClick={() => console.log(state.cartDocument, 'user selected items')}
                        variant="contained"
                        color="primary"
                        disabled={checkBtnDisabled()}
                        sx={{
                            '&:disabled': {
                                opacity: 0.4,
                                pointerEvents: 'none',
                            },
                        }}
                        style={{color: "white", backgroundColor: "#B21F18"}}>
                        Add To Cart ({state.cart})
                    </Button>
                </Grid>

            </Grid>


            {state.toasterMessage &&
                <Toaster message={state.toasterMessage} removeToaster={removeToaster} severity={state.toasterColor}/>}
        </div>
    );
}

export default ColorDetailsUser;