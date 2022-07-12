import { useState, useEffect, useRef } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import IItem from '../models/IItem';
import { getItems, postItem } from '../services/item';

const ExpenseTracker = () => {
    const [items, setItems] = useState<IItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const payeeNameRef = useRef<HTMLSelectElement | null>(null);
    const priceRef = useRef<HTMLInputElement | null>(null);
    const productRef = useRef<HTMLInputElement | null>(null);
    const dateRef = useRef<HTMLInputElement | null>(null);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const addItem = async () => {
        if(payeeNameRef.current?.value === '' || priceRef.current?.value === '' || productRef.current?.value === '' || dateRef.current?.value === ''){
            setShow(false);
         }else{
        const item = {
            payeeName: payeeNameRef.current?.value || '',
            price: parseInt(priceRef.current?.value || '0'),
            product: productRef.current?.value || '',
            setDate: dateRef.current?.value || ''
        };        
        const newItem = await postItem(item);
     
            setItems(
                [
                    ...items,
                    newItem
                ]
            );
        }
        setShow(false);
    }

    const fetchItems = async () => {
        setLoading(true);
        const items = await getItems();
        setItems(items);
        setLoading(false);
    };

    const personalExpense = (payeeName: string) => {
        return items
            .filter(i => i.payeeName === payeeName) // only items paid for by payeeName
            .reduce((acc, i) => acc + i.price, 0) // total of all items
    };

    const TotalExpense = () => {
        const totalExpense = Math.abs(personalExpense('Rahul') + personalExpense('Ramesh'));

        return totalExpense
    };

    const getPayable = () => {
        const rahulPaid = personalExpense('Rahul');
        const rameshPaid = personalExpense('Ramesh');

        return {
            payable: Math.abs(rahulPaid - rameshPaid) / 2,
            message: rahulPaid < rameshPaid ? 'Rahul has to pay:' : 'Ramesh has to pay:'
        };
    };

    useEffect(
        () => {
            fetchItems();
        },
        [] // effect function to run only on component load
    );

    return (
        <Container className="my-3">
            <h1 className="text-center" style={{ background: 'gray', color: 'YellowGreen' }}>
                Expense Tracker
            </h1>
            <Button className="my-2" variant="primary float-end" onClick={handleShow}>Add an item</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add an item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="payeeName">
                            <Form.Label>Who paid?</Form.Label>
                            <Form.Select aria-label="Default select example" ref={payeeNameRef}>
                                <option value="">Select one</option>
                                <option value="Rahul">Rahul</option>
                                <option value="Ramesh">Ramesh</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="price"
                        >
                            <Form.Label>Expense amount</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="How much was spent? (Rs.)"
                                ref={priceRef}
                            />
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="product"
                        >
                            <Form.Label>Describe the expense</Form.Label>
                            <Form.Control
                                placeholder="Description of Expense"
                                ref={productRef}
                            />
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="date"
                        >
                            <Form.Label>Expense Date</Form.Label>
                            <Form.Control
                                placeholder="Date"
                                type="Date"
                                ref={dateRef}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addItem}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr style={{ background: 'black', color: 'white' }}>
                        <th>Date</th>
                        <th>Expense Description</th>
                        <th>Price</th>
                        <th>Payee</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        /* Exercise: Go through items and display a row for every expense item */
                        items.map(
                            item => (
                                <tr key={item.id}>
                                    <td style={{ background: 'goldenrod' }}>{item.setDate}</td>
                                    <td style={{ background: 'Cyan' }}>{item.product}</td>
                                    <td style={{ background: 'BlueViolet' }}>{item.price}</td>
                                    <td style={item.payeeName === 'Rahul' ? { background: 'Turquoise' } : { background: 'CadetBlue' }}>{item.payeeName}</td>
                                </tr>
                            )
                        )
                    }
                </tbody>
                <tfoot className={'text-end'}>
                    <tr>
                        <td style={{ background: 'Cyan' }} colSpan={1}>Total Expense: </td>
                        <td style={{ background: 'MediumSpringGreen	' }}>{TotalExpense()}</td>
                    </tr>
                    <tr>
                        <td style={{ background: 'Cyan' }} colSpan={1}>Rahul Paid: </td>
                        <td style={{ background: 'Turquoise' }}>{personalExpense('Rahul')}</td>
                    </tr>
                    <tr>
                        <td style={{ background: 'Cyan' }} colSpan={1}>Ramesh Paid: </td>
                        <td style={{ background: 'CadetBlue' }}>{personalExpense('Ramesh')}</td>
                    </tr>
                    <tr style={{ background: 'LightCoral' }}>
                        <td colSpan={1} className="text-end">
                            {getPayable().message}
                        </td>
                        <td className="text-end font-monospace">{getPayable().payable}</td>
                    </tr>
                </tfoot>
            </Table>
        </Container>
    );
};

export default ExpenseTracker;