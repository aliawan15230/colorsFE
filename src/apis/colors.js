import axios from 'axios';

let url = 'http://localhost:4000/apis/colors'

export async function getColor(id) {
    try {
        const response = await axios.get(`${url}/color/${id}`);
        return response.data
    } catch (e) {
        return e;
    }
}

export async function getAllColors(page, offset=10) {
    try {
        const response = await axios.get(`${url}/`, {
            params: {page, offset}
        });
        return response.data
    } catch (e) {
        return e;
    }
}

export async function updateColor(id, data) {
    try {
        const response = await axios.put(`${url}/color/${id}`, data);
        return response.data
    } catch (e) {
        return e;
    }
}

export async function addColor(data) {
    try {
        const response = await axios.post(`${url}/color`, data);
        return response.data
    } catch (e) {
        return e;
    }
}