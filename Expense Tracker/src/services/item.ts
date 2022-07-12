import axios from 'axios';
import { idText, isTemplateSpan } from 'typescript';
import IItem from '../models/IItem';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

// function to get items from the backend
const getItems = async () => {
    const response = await axios.get<IItem[]>(`${baseUrl}/items`);
    return response.data;
};

const postItem = async (item: Omit<IItem, 'id'>) => {
    const response = await axios.post<IItem>(
        `${baseUrl}/items`,
        item,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data;
};

export {
    getItems,
    postItem
};
