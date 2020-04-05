import React, { Component } from 'react'
import { Navbar, Nav, Icon, Dropdown, Panel, ButtonToolbar, Button, InputGroup, Input, Table, Modal, ButtonGroup, IconButton } from 'rsuite';
import { Form, Field } from 'react-final-form'
import 'rsuite/dist/styles/rsuite-default.css';

const { Column, HeaderCell, Cell } = Table;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      editUser: {},
      showModal: false,
      showEdit: false,
      showAdd: false,
      id: 0,
      data: []
    };
  }

  componentDidMount() {
    if(!localStorage.getItem(`user-data`)) {
      localStorage.setItem(`user-data`, JSON.stringify(this.state.data))
    }
    let data = localStorage.getItem(`user-data`);
    this.setState({
        data: JSON.parse(data)
    })
  }

  handleShowModal = () => {
    this.setState({
      showModal: true,
      showAdd: true
    });
  };

  onSubmit = values => {
    values.id = ++this.state.id;
    this.state.data.push(values);
    this.setState({
      showModal: false,
      showAdd: false,
      id: values.id,
      data: this.state.data
    })
    localStorage.setItem("user-data", JSON.stringify(this.state.data))
  }

  updateUser = values => {
    let newUser = this.state.data.map( item => item.id === values.id ? values : item);
    this.setState({
      data: newUser,
      showModal: false,
      showEdit: false
    })
    localStorage.setItem("user-data", JSON.stringify(newUser));
  }

  handleCloseModal = () => {
    this.setState({
      showModal: false,
      showEdit: false,
      showAdd: false
    });
  };

  handleEditAction = (id) => {
    let findUser = this.state.data.find( item => item.id === id);
    this.setState({
      showModal: true,
      showEdit: true,
      editUser: {...findUser}
    })
    console.log(findUser)
  }

  handleDeleteAction = (id) => {
    console.log(id)
    let newArray = this.state.data.filter( item => item.id != id );
    this.setState({
      data: newArray
    });
    localStorage.setItem("user-data", JSON.stringify(newArray) )
  }

  onSubmitSearch = values => {
    let currentData = JSON.parse(localStorage.getItem("user-data"));
    let currentUser = currentData.filter( item => item.name.indexOf(values.search) > -1 );
    console.log(currentUser);
    this.setState({
      data: currentUser
    });
  }


  render() {
    return (
      <>
        <div className="table-toolbar">
          {/* <InputGroup inside className="inner-left" style={{ marginRight: 10}}>
            <Input placeholder="Search" />
            <InputGroup.Addon>
              <Icon icon="search" />
            </InputGroup.Addon>
          </InputGroup> */}
          <Form className="inner-left"
            onSubmit={this.onSubmitSearch }
            initialValues={{ }}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
              <form onSubmit={ handleSubmit } style={{ display: "flex", marginTop: "2px" }} >
                <div>
                  <Field
                    name="search"
                    component="input"
                    type="text"
                    placeholder="Search"
                    style={{ marginTop: "6px" }}
                    size={"30"}
                    required
                  />
                </div>
                <div className="buttons">
                  <ButtonGroup>
                    <IconButton type="submit" icon={<Icon icon="search" />}  onClick={this.searchUser} />
                  </ButtonGroup>
                </div>
              </form>
            )}
          />

          <ButtonToolbar className="inner-right">
            <Button appearance="primary" onClick={this.handleShowModal}>
              New
            </Button>
          </ButtonToolbar>
        </div>
        <div>
          <Table
            style={{margin: '0 auto'}}
            height={400}
            width={1050}
            data={this.state.data}
            onRowClick={data => {
              // console.log(data);
            }}
          >
            <Column width={50} align="center" fixed>
              <HeaderCell>Id</HeaderCell>
              <Cell dataKey="id" />
            </Column>

            <Column width={150} align="center">
              <HeaderCell>Full Name</HeaderCell>
              <Cell dataKey="name" />
            </Column>

            <Column width={150} align="center">
              <HeaderCell>Address</HeaderCell>
              <Cell dataKey="address" />
            </Column>

            <Column width={150} align="center">
              <HeaderCell>Phone</HeaderCell>
              <Cell dataKey="phone" />
            </Column>

            <Column width={250} align="center">
              <HeaderCell>Email</HeaderCell>
              <Cell dataKey="email" />
            </Column>
            <Column width={150} align="center" fixed="right">
              <HeaderCell>Action</HeaderCell>

              <Cell>
                {rowData => {
                  // function handleAction() {
                  //   alert(`id:${rowData.id}`);
                  // }
                  return (
                    <span>
                      <a onClick={() => this.handleEditAction(rowData.id)}> Edit </a> |{' '}
                      <a onClick={() => this.handleDeleteAction(rowData.id)}> Remove </a>
                    </span>
                  );
                }}
              </Cell>
            </Column>
          </Table>
        </div>
        <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
          <Modal.Header>
            {this.state.showAdd ? <Modal.Title>Add New User</Modal.Title> : ""}
            {this.state.showEdit ? <Modal.Title>Edit User</Modal.Title> : ""}
          </Modal.Header>
          <Modal.Body >
          <Form
            onSubmit={this.state.showAdd ? this.onSubmit : this.updateUser }
            initialValues={{ }}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
              <form onSubmit={ handleSubmit }>
                <div>
                  <Field
                    name="id"
                    component="input"
                    type="hidden"
                    initialValue={ this.state.showEdit ? this.state.editUser.id : "" }
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ color: '#000', marginRight: '50px'}} >Name</label>
                  <Field
                    name="name"
                    component="input"
                    type="text"
                    placeholder="Full Name"
                    style={{ width: '350px' }}
                    initialValue={ this.state.showEdit ? this.state.editUser.name : "" }
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ color: '#000', marginRight: '37px'}} >Address</label>
                  <Field
                    name="address"
                    component="input"
                    type="text"
                    placeholder="Address Home"
                    style={{ width: '350px' }}
                    initialValue={ this.state.showEdit ? this.state.editUser.address : "" }
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ color: '#000', marginRight: '48px'}} >Phone</label>
                  <Field
                    name="phone"
                    component="input"
                    type="text"
                    placeholder="Phone Number"
                    style={{ width: '350px' }}
                    initialValue={ this.state.showEdit ? this.state.editUser.phone : "" }
                  />
                </div>
                <div>
                  <label style={{ color: '#000', marginRight: '54px'}} >Email</label>
                  <Field
                    name="email"
                    component="input"
                    type="email"
                    placeholder="Email Address"
                    style={{ width: '350px' }}
                    initialValue={ this.state.showEdit ? this.state.editUser.email : "" }
                  />
                </div>

                <div className="buttons" style={{ marginTop: '20px', textAlign: 'right'}}>
                  {this.state.showAdd ? <Button type="submit" appearance="primary"> ADD NEW </Button> : ""}
                  {this.state.showEdit ? <Button type="submit" appearance="primary"> Edit </Button> : ""}
                  <Button type="button" onClick={this.handleCloseModal} appearance="subtle">
                    CANCEL
                  </Button>
                </div>
              </form>
            )}
          />            
          </Modal.Body>
        </Modal>
      </>     
    )
  }
}
