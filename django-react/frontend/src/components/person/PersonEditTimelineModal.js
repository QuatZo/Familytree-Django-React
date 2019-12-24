// frontend/src/components/PersonEditTimelineModal.js
/*eslint array-callback-return: 0*/
/*eslint no-useless-computed-key: 0*/

    import React, { Component } from "react";
    import DatePicker from "react-datepicker";
    import Timeline from 'react-image-timeline';
    import 'react-datepicker/dist/react-datepicker.css';
    import './PersonEdit.css'
    import 'react-image-timeline/dist/timeline.css';
    import axios from "axios";
    import {NOTIFY} from '../Enums.ts';
    import ShowNotification from '../notification/Notification';
    import Switch from "react-switch";
    import ModalMilestone from './MilestoneModal'
    import ModalRelationship from '../relationship/RelationshipModal'
    import ReactPlayer from 'react-player'
    
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

    const CustomHeader = (props) => {
      const {title, date} = props.event;
      return (
        <div className="custom-header">
          <h2 className="rt-title">{title}</h2>
          <p className="rt-date">{(new Date(date)).toISOString().slice(0, 10)}</p>
        </div>
      )
    }

    const CustomImageBody = (props) => {
      const { imageUrl } = props.event;
      return (
        <div className="custom-image-body">
          {ReactPlayer.canPlay(imageUrl) ? <ReactPlayer url={imageUrl} controls={true} width='100%' height='100%'/> : <img src={imageUrl} alt="" className="rt-image" />}
        </div>
      );
    };

    const CustomTextBody = (props) => {
      const {text, extras} = props.event;
      return (
        <div className="custom-text-body">
          <p>{text}</p>
          <p><b>{extras !== null && extras.end_date !== undefined && extras.end_date !== null? "End: " + extras.end_date + "\n": ""}</b></p>
          <p><b>{extras !== null && extras.relationship !== undefined ? "Type: " + extras.relationship : ""}</b></p>
          <p><b>{extras !== null && extras.together_with !== undefined && extras.together_with.length ? "Together with: " + extras.together_with.join(", ") : ""}</b></p>
        </div>
      );
    }


    export default class CustomModal extends Component {
      constructor(props) {
        super(props);
        this.state = {
          activeItem: this.props.activeItem,
          activeMilestone: [],
          activeRelationship: [],
          touched: {
            first_name: false,
            last_name: false,
          },
          timelineData: [],
          deleteMode: false,
          personList: [],
        };
      }

      file = null;

      componentDidMount(){
        this.refreshPersonList();
      }

      refreshPersonList = () => {
        axios
          .get("http://localhost:8000/api/familytreepersons/", {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(res => this.setState({ personList: res.data }))
          .then(this.downloadTimelineData())
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR);
          });
      };

      downloadTimelineData(){
        var data = [];
        axios
        .get("http://localhost:8000/api/familytreemilestone/", {
          headers: { Authorization: `JWT ${localStorage.getItem('token')}`},
          params: { person_id: this.props.activeItem.id }
        })
        .then(res => {
          res.data.map(item => {
            var dateStr = item.date.split("-");
            var togetherWithNames = [];
            var togetherWith = this.state.personList.filter(el => el.id !== this.props.activeItem.id && item.person_id.includes(el.id));

            togetherWith.map(person => {
              togetherWithNames.push(person.first_name + " " + person.last_name);
            })

            data.push({
              date: new Date(parseInt(dateStr[0]), parseInt(dateStr[1]) - 1, parseInt(dateStr[2])), // new Date uses months indexes, so 0-11 instead of 1-12; strange but true
              text: item.text,
              title: item.title,
              buttonText: (this.state.deleteMode ? "Delete" : "Edit") + " Milestone",
              imageUrl: item.image,
              extras: {
                together_with: togetherWithNames,
              },
              onClick: () => { this.state.deleteMode ? this.handleDeleteMilestone(item) : this.editMilestone(item) }
            });
          });
        })
        .then( () => {
          axios
          .get("http://localhost:8000/api/familytreerelationship/", {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`},
            params: { id_1: this.props.activeItem.id }
          })
          .then(res => {
            res.data.map(item => {
              var dateStr = item.begin_date.split("-");
              var togetherWithNames = [];
              var togetherWith = this.state.personList.filter(el => el.id !== this.props.activeItem.id && el.id === item.id_2);

              togetherWith.map(person => {
                togetherWithNames.push(person.first_name + " " + person.last_name);
              })

              data.push({
                date: new Date(parseInt(dateStr[0]), parseInt(dateStr[1]) - 1, parseInt(dateStr[2])), // new Date uses months indexes, so 0-11 instead of 1-12; strange but true
                text: item.description,
                title: item.title,
                buttonText: (this.state.deleteMode ? "Delete" : "Edit") + " Relationship",
                imageUrl: "/media/milestones/default.jpg",
                extras: {
                  end_date: item.end_date,
                  relationship: item.relationships,
                  together_with: togetherWithNames,
                },
                onClick: () => { this.state.deleteMode ? this.handleDeleteRelationship(item) : this.editRelationship(item)}
              })
            })
          })
          .then( () => {
            axios
            .get("http://localhost:8000/api/familytreerelationship/", {
              headers: { Authorization: `JWT ${localStorage.getItem('token')}`},
              params: { id_2: this.props.activeItem.id }
            })
            .then(res => {
              res.data.map(item => {
                var dateStr = item.begin_date.split("-");
                var togetherWithNames = [];
                var togetherWith = this.state.personList.filter(el => el.id !== this.props.activeItem.id && el.id === item.id_1);

                togetherWith.map(person => {
                  togetherWithNames.push(person.first_name + " " + person.last_name);
                })

                data.push({
                  date: new Date(parseInt(dateStr[0]), parseInt(dateStr[1]) - 1, parseInt(dateStr[2])), // new Date uses months indexes, so 0-11 instead of 1-12; strange but true
                  text: item.description,
                  title: item.title,
                  buttonText: (this.state.deleteMode ? "Delete" : "Edit") + " Relationship",
                  imageUrl: "/media/milestones/default.jpg",
                  extras: {
                    end_date: item.end_date,
                    relationship: item.relationships,
                    together_with: togetherWithNames,
                  },
                  onClick: () => { this.state.deleteMode ? this.handleDeleteRelationship(item) : this.editRelationship(item)}
                })
              });
              this.setState({timelineData: data});
            })
          })
        })
        .catch(err => {
          console.log(err);
          ShowNotification(NOTIFY.ERROR);
          this.setState({timelineData: []});
        });
      }

      createMilestone = () => {
        this.setState({ activeMilestone: {
          user_id: localStorage.getItem("user_id"),
          person_id: [this.props.id],
          date: "",
          title: "",
          text: "",
          image: "/media/milestones/default.jpg"
        }, ModalMilestone: !this.state.ModalMilestone });
      }

      editMilestone = item => {
        this.setState({ activeMilestone: item, ModalMilestone: !this.state.ModalMilestone });
      };

      editRelationship = item => {
        this.setState({ activeRelationship: item, ModalRelationship: !this.state.ModalRelationship });
      };
      
      handleSubmitMilestone = (item, file) => {
        this.toggleMilestoneModal();
        var SHA256, newFilename, oldItem, i;

        item.person_id = item.person_id.filter(el => el !== undefined);

        if (item.id) {
          SHA256 = require("crypto-js/sha256");
          newFilename = file !== null ? SHA256(Date.now().toString() + file.name) + file.name.substring(file.name.indexOf(".")) : null;
          oldItem = this.props.activeItem;

          let data = new FormData();
        
          if(oldItem.user_id !== item.user_id) data.append('user_id', item.user_id);
          for(i = 0; i < item.person_id.length; i++){
            data.append('person_id', item.person_id[i]);
          }
          if(oldItem.date !== item.date) data.append('date', item.date);
          if(oldItem.text !== item.text) data.append('text', item.text);
          if(oldItem.title !== item.title) data.append('title', item.title);
          if(oldItem.image !== file && file !== null) data.append('image', file, newFilename); // sha256 encryption

          axios
          .patch(`http://localhost:8000/api/familytreemilestone/${item.id}/`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `JWT ${localStorage.getItem('token')}`
            }
          })
            .then(() => this.downloadTimelineData())
            .then(() => ShowNotification(NOTIFY.SAVE_MILESTONE))
            .catch(err => {
              console.log(err);
              ShowNotification(NOTIFY.ERROR);
            });
          return;
        }

        SHA256 = require("crypto-js/sha256");
        newFilename = SHA256(Date.now().toString() + file.name) + file.name.substring(file.name.indexOf("."));

        let data = new FormData();
        data.append('user_id', item.user_id);
        
        for(i = 0; i < item.person_id.length; i++){
          data.append('person_id', item.person_id[i]);
        }

        data.append('date', item.date);
        data.append('text', item.text);
        data.append('title', item.title);
        data.append('image', file, newFilename); // sha256 encryption

        axios.post('http://localhost:8000/api/familytreemilestone/', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `JWT ${localStorage.getItem('token')}`
          }
        })
          .then(() => this.downloadTimelineData())
          .then(() => ShowNotification(NOTIFY.ADD_MILESTONE))
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR);
          });
      };

      handleSubmitRelationship = item => {
        console.log(item);
        this.toggleRelationshipModal();        
        if (item.id) {
          const options = {
            url: `http://localhost:8000/api/familytreerelationship/${item.id}/`,
            content: item,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`
            },
            data: item
          };
          axios(options)
            .then(() => this.downloadTimelineData())
            .then(() => this.props.refreshRelationships())
            .then(() => ShowNotification(NOTIFY.SAVE_RELATIONSHIP))
            .catch(err => {
              console.log(err);
              ShowNotification(NOTIFY.ERROR);
            });
          return;
        } 
      };

      handleDeleteMilestone = item => {
        axios
          .delete(`http://localhost:8000/api/familytreemilestone/${item.id}`, {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(() => this.downloadTimelineData())
          .then(() => ShowNotification(NOTIFY.DELETE_MILESTONE))
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR);
          });
      };

      handleDeleteRelationship = item => {
        axios
          .delete(`http://localhost:8000/api/familytreerelationship/${item.id}`, {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(() => this.downloadTimelineData())
          .then(() => this.props.refreshRelationships())
          .then(() => ShowNotification(NOTIFY.DELETE_RELATIONSHIP))
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR);
          });
      };

      handleChange = (e) => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value};
        this.setState({ activeItem });
      };

      handleChangeDate = date => {
        const activeItem = { ...this.state.activeItem, ["birth_date"]: (new Date(date)).toISOString().slice(0, 10)};
        this.setState({activeItem});
      };

      handleChangeMode = checked => {
        this.setState({ deleteMode: checked }, () => this.downloadTimelineData());
      }
      
      validate(first_name, last_name){
        return{
          first_name: first_name.trim().length === 0,
          last_name: last_name.trim().length === 0
        }
      }
      
      handleChangeFile = (e) => {
        this.file = e.target.files[0];
      }

      handleBlur = (field) => (evt) => {
        this.setState({
          touched: { ...this.state.touched, [field]: true },
        });
      }

      toggleMilestoneModal = () => {
        this.setState({ ModalMilestone: !this.state.ModalMilestone });
      };

      toggleRelationshipModal = () => {
        this.setState({ ModalRelationship : !this.state.ModalRelationship });
      };

      render() {
        const { toggle, onSave } = this.props;
        const errors = this.validate(this.state.activeItem.first_name, this.state.activeItem.last_name);
        const isEnabled = !Object.keys(errors).some(x => errors[x]);
        return (
          <React.Fragment>
            <Modal 
              isOpen={true} 
              toggle={toggle} 
              size="xl"
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
                  <Row>
                    <Col>
                    <FormGroup style={{display: 'flex'}}>
                      <Label for="avatar">Change Avatar</Label>
                      <Input
                        type="file"
                        name="avatar"
                        onChange={this.handleChangeFile}
                      />
                    </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup style={{display: 'flex'}}>
                        <Label for="switch-delete-mode" style={{marginRight: '10px'}}>Delete Mode</Label>
                        <Switch 
                          name="switch-delete-mode" 
                          onChange={this.handleChangeMode} 
                          checked={this.state.deleteMode} 
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <Button color="success" onClick={() => this.createMilestone()} style={{float: 'right'}}>
                        Add Milestone
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </ModalHeader>
              {this.state.timelineData.length < 1 ? null : 
              <ModalBody>
                <div className="personModalTimeline">
                  <Timeline events={this.state.timelineData} customComponents={{header: CustomHeader, imageBody: CustomImageBody, textBody: CustomTextBody}}/>
                </div>
              </ModalBody>
              }
              <ModalFooter>
                <Button disabled={!isEnabled} color="success" onClick={() => onSave(this.state.activeItem, this.file)}>
                  Save
                </Button>
              </ModalFooter>
            </Modal>
            {this.state.ModalMilestone ? (
              <ModalMilestone
                id={this.props.activeItem.id}
                activeItem={this.state.activeMilestone}
                toggle={this.toggleMilestoneModal}
                onSave={this.handleSubmitMilestone}
              />
            ) : null}
            {this.state.ModalRelationship ? (
              <ModalRelationship
                activeItem={this.state.activeRelationship}
                toggle={this.toggleRelationshipModal}
                onSave={this.handleSubmitRelationship}
              />
            ) : null}
          </React.Fragment>
        );
      }
    }