// frontend/src/components/PersonEditTimelineModal.js
/*eslint array-callback-return: 0*/
/*eslint no-useless-computed-key: 0*/

    import React, { Component } from "react";
    import DatePicker from "react-datepicker";
    import Timeline from 'react-image-timeline';
    import 'react-datepicker/dist/react-datepicker.css';
    import './PersonEdit.css'
    import '../Modal.css'
    import 'react-image-timeline/dist/timeline.css';
    import axios from "axios";
    import {NOTIFY} from '../Enums.ts';
    import ShowNotification from '../notification/Notification';
    import Switch from "react-switch";
    import ModalMilestone from './MilestoneModal'
    import ModalRelationship from '../relationship/RelationshipModal'
    import ReactPlayer from 'react-player'
    import moment from 'moment'
    import Dropzone from 'react-dropzone'
    
    import {
      Button,
      CustomInput,
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

    function getRelativePath(mediaFile){
      return mediaFile.substring(mediaFile.indexOf('/media'))
    }

    // custom header for Timeline component, consists of different date format (yyyy-mm-dd)
    const CustomHeader = (props) => {
      const {title, date, extras} = props.event;
      return (
        <div className="custom-header">
          <h2 className="rt-title">{title}</h2>
          <p className="rt-date">{(new Date(date)).toISOString().slice(0, 10)}</p>
          {extras !== null && extras.theme !== undefined ? (<hr className={"hr-body " + extras.theme}/>) : null}
        </div>
      )
    }

    // custom image body for Timeline to support media type files (ReactPlayer component) along with images
    const CustomImageBody = (props) => {
      const { imageUrl } = props.event;
      return (
        <div className="custom-image-body">
          {ReactPlayer.canPlay(imageUrl) ? <ReactPlayer url={getRelativePath(imageUrl)} controls={true} width='100%' height='100%'/> : <img src={getRelativePath(imageUrl)} alt="" className="rt-image" />}
        </div>
      );
    };

    // custom text body for Timeline to include end date of relationship, type of relationship & comrades
    const CustomTextBody = (props) => {
      const {text, extras} = props.event;
      return (
        <div className="custom-text-body">
          {extras !== null && extras.theme !== undefined ? (<hr className={"hr-body " + extras.theme}/>) : null}
          <p>{text}</p>
          <p><b>{extras !== null && extras.end_date !== undefined && extras.end_date !== null? "End: " + extras.end_date + "\n": ""}</b></p>
          <p><b>{extras !== null && extras.relationship !== undefined ? "Type: " + extras.relationship : ""}</b></p>
          <p><b>{extras !== null && extras.together_with !== undefined && extras.together_with.length ? "Together with: " + extras.together_with.join(", ") : ""}</b></p>
          {extras !== null && extras.theme !== undefined ? (<hr className={"hr-body " + extras.theme}/>) : null}
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
          timelineData: [], // data used for Timeline
          deleteMode: false, // flag, if delete mode is enabled
          personList: [], // list of Persons
          fileMessage: "Drag 'n' drop file here, or click to select file",
        };
      }

      componentDidMount(){
        this.refreshPersonList();
      }

      refreshPersonList = () => {
        axios
          .get("/api/familytreepersons/", {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(res => this.setState({ personList: res.data }))
          .then(this.downloadTimelineData())
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR, this.props.theme);
          });
      };

      // downloads data from API, if it fails to download any type of data, then it don't display anything (to not mix up in users' head)
      downloadTimelineData(){
        var data = [];
        // firstly, download all milestones for certain Person
        axios
        .get("/api/familytreemilestone/", {
          headers: { Authorization: `JWT ${localStorage.getItem('token')}`},
          params: { person_id: this.props.activeItem.id }
        })
        .then(res => {
          Array.from(res.data).map(item => {
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
              buttonText: (this.state.deleteMode ? "Usuń" : "Edit") + " Milestone",
              imageUrl: item.image,
              extras: {
                together_with: togetherWithNames,
                theme: this.props.theme,
              },
              onClick: () => { this.state.deleteMode ? this.props.toggleConfirmModal("Delete Milestone", "Are you sure you want to delete this milestone?", "Usuń", "Anuluj", () => this.handleDeleteMilestone(item)) : this.editMilestone(item) }
            });
          });
        })
        .then( () => {
          // then, download all relationship for certain Person, where it's 1st person in relationship
          axios
          .get("/api/familytreerelationship/", {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`},
            params: { id_1: this.props.activeItem.id }
          })
          .then(res => {
            Array.from(res.data).map(item => {
              if(item.begin_date){
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
                  buttonText: (this.state.deleteMode ? "Usuń" : "Edit") + " Relationship",
                  imageUrl: "/media/milestones/default.jpg",
                  extras: {
                    end_date: item.end_date,
                    relationship: item.relationships,
                    together_with: togetherWithNames,
                    theme: this.props.theme,
                  },
                  onClick: () => { this.state.deleteMode ? this.props.toggleConfirmModal("Delete Relationship", "Are you sure you want to delete this relationship?", "Usuń", "Anuluj", () => this.handleDeleteRelationship(item)) : this.editRelationship(item)}
                })
              }
            })
          })
          .then( () => {
            // then, download remaining relationship for certain Person, where it's 2nd person in relationship
            axios
            .get("/api/familytreerelationship/", {
              headers: { Authorization: `JWT ${localStorage.getItem('token')}`},
              params: { id_2: this.props.activeItem.id }
            })
            .then(res => {
              Array.from(res.data).map(item => {
                if(item.begin_date){
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
                    buttonText: (this.state.deleteMode ? "Usuń" : "Edit") + " Relationship",
                    imageUrl: "/media/milestones/default.jpg",
                    extras: {
                      end_date: item.end_date,
                      relationship: item.relationships,
                      together_with: togetherWithNames,
                      theme: this.props.theme,
                    },
                    onClick: () => { this.state.deleteMode ? this.props.toggleConfirmModal("Delete Relationship", "Are you sure you want to delete this relationship?", "Usuń", "Anuluj", () => this.handleDeleteRelationship(item)) : this.editRelationship(item)}
                  })
                }
              });
              this.setState({timelineData: data});
            })
          })
        })
        .catch(err => {
          console.log(err);
          ShowNotification(NOTIFY.ERROR, this.props.theme);
          this.setState({timelineData: []});
        });
      }

      // prepares form for creating new Milestone
      createMilestone = () => {
        this.setState({ activeMilestone: {
          user_id: localStorage.getItem("user_id"),
          person_id: [this.props.id],
          date: "",
          title: "",
          text: "",
          image: undefined
        }, ModalMilestone: !this.state.ModalMilestone });
      }

      // prepares form for editing existing Milestone
      editMilestone = item => {
        this.setState({ activeMilestone: item, ModalMilestone: !this.state.ModalMilestone });
      };

      // prepares form for editin existin Relationship
      editRelationship = item => {
        this.setState({ activeRelationship: item, ModalRelationship: !this.state.ModalRelationship });
      };
      
      // handles new/existing milestone submission
      handleSubmitMilestone = (item) => {
        this.toggleMilestoneModal();
        var SHA256, newFilename, oldItem, i;

        item.person_id = item.person_id.filter(el => el !== undefined); // makes sure there is no 'undefined' person i chosen Person List

        // if Milestone already exists
        if (item.id) {
          SHA256 = require("crypto-js/sha256");
          newFilename = item.image !== null && item.image.name !== undefined ? SHA256(Date.now().toString() + item.image.name) + item.image.name.substring(item.image.name.indexOf(".")) : null; // SHA256 encryption for filename (media/image)
          oldItem = this.props.activeItem;

          let data = new FormData();
        
          if(oldItem.user_id !== item.user_id) data.append('user_id', item.user_id);
          for(i = 0; i < item.person_id.length; i++){
            data.append('person_id', item.person_id[i]);
          }
          if(oldItem.date !== item.date) data.append('date', item.date);
          if(oldItem.text !== item.text) data.append('text', item.text);
          if(oldItem.title !== item.title) data.append('title', item.title);
          if(oldItem.image !== item.image && item.image !== null && newFilename !== null) data.append('image', item.image, newFilename); // sha256 encryption

          axios
          .patch(`/api/familytreemilestone/${item.id}/`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `JWT ${localStorage.getItem('token')}`
            }
          })
            .then(() => this.downloadTimelineData())
            .then(() => ShowNotification(NOTIFY.SAVE_MILESTONE, this.props.theme))
            .catch(err => {
              console.log(err);
              ShowNotification(NOTIFY.ERROR, this.props.theme);
            });
          return;
        }

        // if there is no Milestone w/ provided ID
        SHA256 = require("crypto-js/sha256"); 
        newFilename = SHA256(Date.now().toString() + item.image.name) + item.image.name.substring(item.image.name.indexOf(".")); // SHA256 encryption for filename (media/image)

        let data = new FormData();
        data.append('user_id', item.user_id);
        
        for(i = 0; i < item.person_id.length; i++){
          data.append('person_id', item.person_id[i]);
        }

        data.append('date', item.date);
        data.append('text', item.text);
        data.append('title', item.title);
        data.append('image', item.image, newFilename); // sha256 encryption

        axios.post('/api/familytreemilestone/', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `JWT ${localStorage.getItem('token')}`
          }
        })
          .then(() => this.downloadTimelineData())
          .then(() => ShowNotification(NOTIFY.ADD_MILESTONE, this.props.theme))
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR, this.props.theme);
          });
      };

      // handles submission of existing Relationship
      handleSubmitRelationship = item => {
        this.toggleRelationshipModal();        
        if (item.id) {
          axios.put(`/api/familytreerelationship/${item.id}/`, item, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`
            }
          })
            .then(() => this.downloadTimelineData())
            .then(() => this.props.refreshRelationships())
            .then(() => ShowNotification(NOTIFY.SAVE_RELATIONSHIP, this.props.theme))
            .catch(err => {
              console.log(err);
              ShowNotification(NOTIFY.ERROR, this.props.theme);
            });
          return;
        } 
      };

      // handles deletetion of existing Milestone
      handleDeleteMilestone = item => {
        this.props.toggleConfirmModal();
        axios
          .delete(`/api/familytreemilestone/${item.id}`, {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(() => this.downloadTimelineData())
          .then(() => ShowNotification(NOTIFY.DELETE_MILESTONE, this.props.theme))
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR, this.props.theme);
          });
      };

      // handles deletion of existing Relationship
      handleDeleteRelationship = item => {
        this.props.toggleConfirmModal();
        axios
          .delete(`/api/familytreerelationship/${item.id}`, {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(() => this.downloadTimelineData())
          .then(() => this.props.refreshRelationships())
          .then(() => ShowNotification(NOTIFY.DELETE_RELATIONSHIP, this.props.theme))
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR, this.props.theme);
          });
      };

      // handles change for any form field, except date & select
      handleChange = (e) => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value};
        this.setState({ activeItem });
      };

      // handles change for Date Fields
      handleChangeDate = date => {
        const activeItem = { ...this.state.activeItem, ["birth_date"]: moment(date).format('YYYY-MM-DD')};
        this.setState({activeItem});
      };
      handleChangeDateDeath = date => {
        const activeItem = { ...this.state.activeItem, ["death_date"]: moment(date).format('YYYY-MM-DD')};
        this.setState({activeItem});
      };

      // handles change of file (upload)
      handleChangeFile = (file) => {
        var fileMessage = "Drag 'n' drop file here, or click to select file";

        if(file !== null){
          fileMessage = file.name;
        }
        const activeItem = { ...this.state.activeItem, ["avatar"]: file};
        this.setState({activeItem, fileMessage});
      }

      // handles mode change from Edit to Delete & vice versa
      handleChangeMode = checked => {
        this.setState({ deleteMode: checked }, () => this.downloadTimelineData());
      }
      
      // error handling, validates value in form fields
      validate(form){
        var file_extension_invalid = false;
        if(form.avatar !== null && form.avatar !== undefined && form.avatar.name !== undefined){
          var extensions = ['.bmp', '.cgm', '.gif', '.ico', '.jpeg', '.jpg', '.png', '.ras', '.rgb', '.svg', '.tiff'];
          var file_ext_check = false;
          extensions.map(ext => {
            var file_ext = form.avatar.name.substring(form.avatar.name.lastIndexOf('.'))
            if(ext === file_ext){
              file_ext_check = true;
            }
          })

          if(!file_ext_check){ file_extension_invalid = true;}
        }

        return{
          first_name: form.first_name.trim().length === 0,
          first_name_too_long: form.first_name.trim().length > 50,
          last_name: form.last_name.trim().length === 0,
          last_name_too_long: form.last_name.trim().length > 50,
          file_extension: file_extension_invalid,
          birth_place: form.birth_place.trim().length > 50,
        }
      }

      // error handling
      handleBlur = (field) => (evt) => {
        this.setState({
          touched: { ...this.state.touched, [field]: true },
        });
      }

      // toggles Milestone modal
      toggleMilestoneModal = () => {
        this.setState({ ModalMilestone: !this.state.ModalMilestone });
      };

      // toggles Relationship modal
      toggleRelationshipModal = () => {
        this.setState({ ModalRelationship : !this.state.ModalRelationship });
      };

      render() {
        const { toggle, onSave } = this.props;
        const errors = this.validate(this.state.activeItem);
        const isEnabled = !Object.keys(errors).some(x => errors[x]); // button is disables as long as error exists
        return (
          <React.Fragment>
            <Modal 
              className={"modal-open-"+this.props.theme}
              isOpen={true} 
              toggle={toggle} 
              size="xl"
            >
              <ModalHeader className={"modal-header-"+this.props.theme} toggle={toggle}> 
                Person
                <Form>
                  <Row form>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="first_name">First Name</Label>
                        <Input
                          type="text"
                          name="first_name"
                          className={this.props.theme + ((errors.first_name || errors.first_name_too_long) ? " error" : "")}
                          onBlur={this.handleBlur('first_name')}
                          value={this.state.activeItem.first_name}
                          onChange={this.handleChange}
                          placeholder="First Name"
                        />
                        {errors.first_name?(<small className={'errortext ' + this.props.theme}>Please insert first name</small>):null}
                        {errors.first_name_too_long?(<small className={'errortext ' + this.props.theme}>This name is too long, max length is 50</small>):null}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="last_name">Last Name</Label>
                        <Input
                          type="text"
                          name="last_name"
                          className={this.props.theme + ((errors.last_name || errors.last_name_too_long) ? " error" : "")}
                          onBlur={this.handleBlur('last_name')}
                          value={this.state.activeItem.last_name}
                          onChange={this.handleChange}
                          placeholder="Last Name"
                        />
                        {errors.last_name?(<small className={'errortext ' + this.props.theme}>Please insert last name</small>):null}
                        {errors.last_name_too_long?(<small className={'errortext ' + this.props.theme}>This name is too long, max length is 50</small>):null}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="sex_choices">Sex</Label>
                        <CustomInput 
                          id="sex_choices"
                          type="select"
                          className={"form-control " + this.props.theme}
                          name = "sex_choices"
                          value={this.state.activeItem.sex_choices}
                          onChange={this.handleChange}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </CustomInput>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row form>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="status_choices">Status of life</Label>
                        <CustomInput 
                          id="status_choices"
                          type="select"
                          className={"form-control " + this.props.theme}
                          name = "status_choices"
                          value={this.state.activeItem.status_choices}
                          onChange={this.handleChange}
                        >
                          <option value="living">Living</option>
                          <option value="deceased">Deceased</option>
                          <option value="unknown">Unknown</option>
                        </CustomInput>
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="birth_date">Birth Date</Label><br />
                        <DatePicker 
                          className={"form-control " + this.props.theme}
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
                    <Col md={3}>
                      <FormGroup>
                        <Label for="birth_place">Birthplace</Label>
                        <Input
                          type="text"
                          className={"form-control " + this.props.theme + (errors.birth_place ? " error" : "")}
                          name="birth_place"
                          value={this.state.activeItem.birth_place}
                          onChange={this.handleChange}
                          placeholder="Place of birth"
                        />
                        {errors.birth_place ? (<small className={'errortext ' + this.props.theme}>This birth place is too long, max length is 50</small>) : null}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="death_date">Death Date</Label><br />
                        <DatePicker 
                          className={"form-control " + this.props.theme}
                          name="death_date"
                          value={this.state.activeItem.death_date}
                          onChange={ this.handleChangeDateDeath} 
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                    <FormGroup>
                      <Label for="avatar" style={{width: '12.5rem'}}>Change Avatar</Label>
                      <Dropzone 
                        onDrop={acceptedFiles => this.handleChangeFile(acceptedFiles[0])}
                        onFileDialogCancel={() => this.handleChangeFile(null)}
                        multiple={false}
                      >
                        {({getRootProps, getInputProps}) => (
                          <section>
                            <div {...getRootProps()} className={"dropzone " + this.props.theme + ((errors.file || errors.file_extension) ? " error" : "")}>
                              <input {...getInputProps()} />
                              <p>{this.state.fileMessage}</p>
                            </div>
                          </section>
                        )}
                      </Dropzone>
                      {errors.file?(<small className={'errortext ' + this.props.theme}>Please upload Image<br/></small>):null}
                      {errors.file_extension?(<small className={'errortext ' + this.props.theme}>This File has unsupported extension. Supported extensions: <b>BMP, CGM, GIF, ICO, JPEG, JPG, PNG, RAS, RGB, SVG, TIFF</b></small>):null}
                    </FormGroup>
                    </Col>
                  </Row>
                  <Row>
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
                      <Button className="confirm" onClick={() => this.createMilestone()} style={{float: 'right'}}>
                        Add Milestone
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </ModalHeader>
              {this.state.timelineData.length < 1 ? null : 
              <ModalBody className={"modal-body-"+this.props.theme}>
                <div className="personModalTimeline">
                  <Timeline events={this.state.timelineData} customComponents={{header: CustomHeader, imageBody: CustomImageBody, textBody: CustomTextBody}}/>
                </div>
              </ModalBody>
              }
              <ModalFooter className={"modal-footer-"+this.props.theme}>
                <Button disabled={!isEnabled} className="confirm" onClick={() => onSave(this.state.activeItem)}>
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
                theme={this.props.theme}
              />
            ) : null}
            {this.state.ModalRelationship ? (
              <ModalRelationship
                activeItem={this.state.activeRelationship}
                toggle={this.toggleRelationshipModal}
                onSave={this.handleSubmitRelationship}
                theme={this.props.theme}
              />
            ) : null}
          </React.Fragment>
        );
      }
    }