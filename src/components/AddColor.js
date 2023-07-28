import React, {useState} from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    DialogTitle, IconButton, DialogContent, Dialog
} from '@mui/material';
import {makeStyles} from "@material-ui/core/styles";
import Toaster from "./Toaster";
import CloseIcon from "@mui/icons-material/Close";
import {addColor} from "../apis/colors";

const useStyles = makeStyles((theme) => ({
    formContainer: {
        background: '#fff',
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 700,
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
    },
    field: {
        backgroundColor: '#F3F3F3',
    },
}));

const AddColor = ({isOpen, closeModal}) => {

    const classes = useStyles();

    const [state, setState] = useState({
        toasterMessage: "",
        toasterColor: 'success',
        title: '',
    });

    const removeToaster = () => {
        setState({...state, toasterColor: 'success', toasterMessage: ""})
    }

    const checkBtnDisabled = () => {
        const {title} = state

        if (title) {
            return false
        } else {
            return true
        }

    }

    const submitForm = async () => {

        try {

            const data = {
                title: state.title
            }

            const res = await addColor(data)

            if (res && res.success) {
                setState({
                    ...state,
                    toasterColor: "success",
                    toasterMessage: `Color Added Successfully`,
                    title: '',
                });

                closeModal(true)
            } else {
                setState({
                    ...state,
                    toasterColor: "error",
                    toasterMessage: `Error while saving data`,
                });
            }

        } catch (e) {
            setState({
                ...state,
                toasterColor: "error",
                toasterMessage: `Error while saving data`
            });

            console.log('error while saving data', e.message)
        }

    }

    return (
        <>
            <Dialog open={isOpen} maxWidth={'lg'}
                    onClose={() => {
                        setState({
                            ...state,
                            toasterMessage: "",
                            toasterColor: 'success',
                            title: '',
                        })

                        closeModal()

                    }}>
                <DialogTitle>
                    <Typography variant="h6">Add Color</Typography>
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            setState({
                                ...state,
                                toasterMessage: "",
                                toasterColor: 'success',
                                title: '',
                            })
                            closeModal()
                        }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'gray',
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div>
                        <Grid container justifyContent="center">
                            <Grid item xs={12}>
                                <Card className={classes.formContainer}>
                                    <CardContent>
                                        <form>
                                            <Grid container spacing={2}>

                                                <Grid item xs={12}>
                                                    <Typography component="span" variant="subtitle1" fontWeight="bold">Add
                                                        Title</Typography>
                                                    <Typography variant="body1" component="span" style={{color: 'red'}}>
                                                        {' *'}
                                                    </Typography>
                                                    <TextField placeholder="Add Title"
                                                               className={classes.field}
                                                               variant="outlined"
                                                               fullWidth
                                                               size="small"
                                                               value={state.title}
                                                               onChange={e => {
                                                                   setState({
                                                                       ...state,
                                                                       title: e.target.value
                                                                   })
                                                               }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} className={classes.buttonContainer}>
                                                    <Button onClick={submitForm} variant="contained" color="primary"
                                                            disabled={checkBtnDisabled()}
                                                            sx={{
                                                                '&:disabled': {
                                                                    opacity: 0.6,
                                                                    pointerEvents: 'none',
                                                                },
                                                            }}
                                                            style={{color: "white", backgroundColor: "#B21F18"}}>
                                                        Submit
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </div>
                </DialogContent>
            </Dialog>


            {state.toasterMessage &&
                <Toaster message={state.toasterMessage} removeToaster={removeToaster} severity={state.toasterColor}/>}

        </>
    );
};

export default AddColor;
