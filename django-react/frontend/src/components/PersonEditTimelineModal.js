// frontend/src/components/PersonModal.js

    import React, { Component } from "react";
    import DatePicker from "react-datepicker";
    import 'react-datepicker/dist/react-datepicker.css';
    import '../PersonEdit.css'
    
    import {
      Button,
      Col,
      Modal,
      ModalHeader,
      ModalBody,
      ModalFooter,
      Row,
      Form,
      FormGroup,
      Input,
      Label,
    } from "reactstrap";

    export default class CustomModal extends Component {
      constructor(props) {
        super(props);
        this.state = {
          activeItem: this.props.activeItem,
          touched: {
            first_name: false,
            last_name: false,
          },
        };
      }
      handleChange = (e) => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value};
        this.setState({ activeItem });
      };
      handleChangeDate = date => {
        const activeItem = { ...this.state.activeItem, ["birth_date"]: (new Date(date)).toISOString().slice(0, 10)};
        this.setState({activeItem});
      };
      validate(first_name, last_name){
        return{
          first_name: first_name.trim().length === 0,
          last_name: last_name.trim().length === 0
        }
      }
      handleBlur = (field) => (evt) => {
        this.setState({
          touched: { ...this.state.touched, [field]: true },
        });
      }
      render() {
        const { toggle, onSave } = this.props;
        const errors = this.validate(this.state.activeItem.first_name, this.state.activeItem.last_name);
        const isEnabled = !Object.keys(errors).some(x => errors[x]);
        return (
          <Modal 
          isOpen={true} 
          toggle={toggle}
          size="lg"
          >
            <ModalHeader toggle={toggle}> 
              Person
              <Form>
                <FormGroup>
                  <Input
                  type="number"
                  name="user_id"
                  value={localStorage.getItem('user_id')}
                  hidden
                  readOnly
                  >
                  </Input>
                </FormGroup>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="first_name">First Name</Label>
                      <Input
                        type="text"
                        name="first_name"
                        className={errors.first_name?"error":""}
                        onBlur={this.handleBlur('first_name')}
                        value={this.state.activeItem.first_name}
                        onChange={this.handleChange}
                        placeholder="First Name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="last_name">Last Name</Label>
                      <Input
                        type="text"
                        name="last_name"
                        className={errors.last_name?"error":""}
                        onBlur={this.handleBlur('last_name')}
                        value={this.state.activeItem.last_name}
                        onChange={this.handleChange}
                        placeholder="Last Name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="sex_choices">Sex</Label>
                      <select
                        className="form-control"
                        name = "sex_choices"
                        value={this.state.activeItem.sex_choices}
                        onChange={this.handleChange}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </FormGroup>
                  </Col>
                </Row>
                <Row form>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="status_choices">Status of life</Label>
                      <select
                        className="form-control"
                        name = "status_choices"
                        value={this.state.activeItem.status_choices}
                        onChange={this.handleChange}
                      >
                        <option value="living">Living</option>
                        <option value="deceased">Deceased</option>
                        <option value="unknown">Unknown</option>
                      </select>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="birth_date">Birth Date</Label><br />
                      <DatePicker 
                        className="form-control"
                        name="birth_date"
                        value={this.state.activeItem.birth_date}
                        onChange={ this.handleChangeDate} 
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="birth_place">Birthplace</Label>
                      <Input
                        type="text"
                        name="birth_place"
                        value={this.state.activeItem.birth_place}
                        onChange={this.handleChange}
                        placeholder="Place of birth"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </ModalHeader>
            <ModalBody>
              <div className="personModalTimeline">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam feugiat eget nibh et finibus. Donec dapibus erat felis, vel ullamcorper quam dapibus tincidunt. Quisque eget hendrerit ante. Etiam tempor quam lacinia urna vehicula dictum. Curabitur imperdiet lorem in erat porta finibus id eget dolor. Proin porttitor quis mauris id gravida. Sed nec mauris luctus, vehicula nisl vitae, sagittis dui. Sed efficitur nec risus semper bibendum. Nam ornare tincidunt diam et viverra. Suspendisse sem nisi, pulvinar ac ligula nec, ornare facilisis libero. Suspendisse potenti. Nulla blandit vestibulum magna.

                Fusce mauris est, blandit at posuere in, suscipit vel ante. Nullam rutrum dapibus tortor ut volutpat. Quisque ex magna, pulvinar ac malesuada sed, maximus id purus. Aliquam ante dui, bibendum imperdiet erat ac, placerat finibus tortor. Vivamus massa mauris, efficitur in magna varius, tempor vestibulum turpis. Sed vehicula tempus sodales. Phasellus in lacus nisi. Morbi dictum lorem nec ullamcorper ullamcorper. Aliquam in vehicula quam.

                Curabitur finibus sagittis quam, et commodo libero condimentum ut. Maecenas leo leo, eleifend eu nibh sit amet, cursus rhoncus lorem. Sed ac rutrum tellus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce bibendum eget mauris vulputate vestibulum. Ut condimentum pharetra fringilla. Nullam metus nulla, suscipit et ante ultrices, ullamcorper volutpat libero. Quisque et odio varius ligula aliquam mattis. Sed varius augue non sem porttitor, eu tincidunt turpis venenatis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec hendrerit neque non varius mattis. Cras vitae orci vitae metus rutrum tempor nec at purus. Vivamus sed porta lacus, at ultricies tortor. Nulla facilisi. Vestibulum dignissim nisi diam, at porttitor tortor ullamcorper in. Suspendisse auctor consequat tellus quis lacinia.

                Vivamus bibendum tempus erat vel lobortis. Praesent eu augue tortor. Ut sed metus lacus. Curabitur felis tortor, egestas eu massa ut, imperdiet consectetur ligula. Integer sit amet sagittis risus, vitae congue urna. Ut pellentesque non erat eget semper. Quisque elementum tristique bibendum. Fusce sodales neque et velit imperdiet interdum. Donec sit amet leo sed dui sodales mattis. In eu finibus orci. Suspendisse faucibus elit a lorem rhoncus pretium eget sit amet erat.

                Aliquam placerat erat tincidunt neque laoreet auctor. Integer sed facilisis libero. Nam vestibulum semper felis vitae dignissim. Mauris vitae vehicula nisl, vitae posuere orci. Mauris cursus viverra lectus. Nam venenatis ullamcorper velit. Aliquam suscipit lacus non purus dapibus bibendum. Nunc ultrices orci non tincidunt porta. Aenean ac facilisis velit. Mauris et vehicula ligula, vitae sollicitudin est. Aliquam nec purus finibus, interdum nunc sed, luctus ante. Ut rutrum ipsum in ex accumsan, eu dignissim nisl dignissim. Cras vel leo vitae lacus vestibulum dictum. Nunc sed dui hendrerit, bibendum nibh a, fringilla velit. Praesent nec sollicitudin ligula. Curabitur ac luctus risus.
              </div>
            </ModalBody>
            <ModalFooter>
              <Button disabled={!isEnabled} color="success" onClick={() => onSave(this.state.activeItem)}>
                Save
              </Button>
            </ModalFooter>
          </Modal>
        );
      }
    }