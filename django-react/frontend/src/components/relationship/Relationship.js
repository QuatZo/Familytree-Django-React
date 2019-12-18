// frontend/src/Relationship.js
/*eslint array-callback-return: 0*/

    import React, { Component } from "react";
    import { Tooltip } from 'react-svg-tooltip';

    class Relationship extends Component {
      constructor(props) {
        super(props);
        this.state = {
          relationshipMarker: [],
          relationship: [],
          personSize: this.props.personSize,
         };
      }

      componentDidMount(){
        this.renderRelationship();
      }

      toggle = () => {
        this.setState({ modal: !this.state.modal });
      };

      calcSideCenters(first, second){
        const nav = document.getElementById("nav").getBoundingClientRect().height - 5;

        var relationshipPoints = {
          top: [
            {x: first.screen.x + this.state.personSize.width / 2, y: first.screen.y},
            {x: second.screen.x + this.state.personSize.width / 2, y: second.screen.y}
          ],
          right: [
            {x: first.screen.x + this.state.personSize.width, y: first.screen.y + this.state.personSize.height / 2},
            {x: second.screen.x + this.state.personSize.width, y: second.screen.y + this.state.personSize.height / 2}
          ],
          bottom: [
            {x: first.screen.x + this.state.personSize.width / 2, y: first.screen.y + this.state.personSize.height},
            {x: second.screen.x + this.state.personSize.width / 2, y: second.screen.y + this.state.personSize.height}
          ],
          left: [
            {x: first.screen.x, y: first.screen.y + this.state.personSize.height / 2},
            {x: second.screen.x, y: second.screen.y + this.state.personSize.height / 2}
          ],
          mid: [
            {x: first.screen.x + this.state.personSize.width / 2, y: first.screen.y + this.state.personSize.height / 2},
            {x: second.screen.x + this.state.personSize.width / 2, y:second.screen.y + this.state.personSize.height / 2}
          ],
        };

        var x1Temp, y1Temp, x2Temp, y2Temp;
        var horizontalTemp = false;

        if(relationshipPoints.top[0].y > relationshipPoints.bottom[1].y + 10){
          x1Temp = relationshipPoints.top[0].x + 5;
          y1Temp = relationshipPoints.top[0].y + nav + 10;
          x2Temp = relationshipPoints.bottom[1].x + 5;
          y2Temp = relationshipPoints.bottom[1].y + nav + 20;
        }
        else if(relationshipPoints.bottom[0].y < relationshipPoints.top[1].y - 10){
          x1Temp = relationshipPoints.bottom[0].x + 5;
          y1Temp = relationshipPoints.bottom[0].y + nav + 5;
          x2Temp = relationshipPoints.top[1].x + 5;
          y2Temp = relationshipPoints.top[1].y + nav;
        }
        else if(relationshipPoints.right[0].x < relationshipPoints.left[1].x){
          x1Temp = relationshipPoints.right[0].x + 5;
          y1Temp = relationshipPoints.right[0].y + nav + 5;
          x2Temp = relationshipPoints.left[1].x + 5;
          y2Temp = relationshipPoints.left[1].y + nav + 5;
          horizontalTemp = true;
        }
        else if(relationshipPoints.left[0].x > relationshipPoints.right[1].x){
          x1Temp = relationshipPoints.left[0].x + 5;
          y1Temp = relationshipPoints.left[0].y + nav + 5;
          x2Temp = relationshipPoints.right[1].x + 5;
          y2Temp = relationshipPoints.right[1].y + nav + 5;
          horizontalTemp = true;
        }
        else{
          x1Temp = relationshipPoints.mid[0].x;
          y1Temp = relationshipPoints.mid[0].y;
          x2Temp = relationshipPoints.mid[0].x;
          y2Temp = relationshipPoints.mid[0].y;
        }

        return {x1: x1Temp, y1: y1Temp, x2: x2Temp, y2: y2Temp, horizontal: horizontalTemp};
      }

      renderRelationship(){
        var relationshipPairList = [];
        var relationshipPersonList = [];
        var relationshipsNames = [];
        var relationshipColor = [];

        this.props.personClassCoordinates.map(person => {
          if(parseInt(this.props.relationship.id_1) === parseInt(person.id) || parseInt(this.props.relationship.id_2) === parseInt(person.id)){
            relationshipPersonList.push(person);
            relationshipsNames.push(this.props.relationship.relationships);
            relationshipColor.push(this.props.relationship.color);
          }
        });

        for (var i = 0; i < relationshipPersonList.length; i += 2){
          var sideCoords = this.calcSideCenters(relationshipPersonList[i], relationshipPersonList[i + 1]);

          var pointsTemp = Math.round(sideCoords.x1) + " " + Math.round(sideCoords.y1) +
          ", " + Math.round(sideCoords.x1) + " " + Math.round((Math.round(sideCoords.y1) + Math.round(sideCoords.y2))/2) +
          ", " + Math.round(sideCoords.x2) + " " + Math.round((Math.round(sideCoords.y1) + Math.round(sideCoords.y2))/2) +
          ", " + Math.round(sideCoords.x2) + " " + Math.round(sideCoords.y2)

          if(sideCoords.horizontal){
            pointsTemp = Math.round(sideCoords.x1) + " " + Math.round(sideCoords.y1) +
            ", " + Math.round((Math.round(sideCoords.x1) + Math.round(sideCoords.x2))/2) + " " + Math.round(sideCoords.y1) +
            ", " + Math.round((Math.round(sideCoords.x1) + Math.round(sideCoords.x2))/2) + " " + Math.round(sideCoords.y2) +
            ", " + Math.round(sideCoords.x2) + " " + Math.round(sideCoords.y2);
          }

          relationshipPairList.push({ 
            id: i / 2,
            relationship: relationshipsNames[i],
            id1: relationshipPersonList[i].id, id2: relationshipPersonList[i+1].id, 
            color: relationshipColor[i],
            points: pointsTemp,
          });
        }

        var reference = [];

        relationshipPairList.map( () => {
          const lineRef = React.createRef();
          reference.push(lineRef);
        })

        this.setState({
          relationshipMarker: (relationshipPairList.map(item => (
            <marker 
            id={'head_' + item.color.substring(1)} 
            key={'head_' + item.color.substring(1)} 
            orient="auto"
            markerWidth='6' markerHeight='6'
            refX='0.1' refY='3'
            >
              <path d='M0,0 V6 L3,3 Z' fill={item.color} stroke={item.color}/>
            </marker>
          ))),
          relationship: (relationshipPairList.map(item => (
            <React.Fragment
            key={"fragment_" + item.id1 + "_" + item.id2}
            >
              <polyline 
              ref={reference[item.id]}
              id={"path_" + item.id1 + "_" + item.id2}
              markerEnd={'url(#head_' + item.color.substring(1) + ')'}
              points={item.points} 
              stroke = {item.color}
              strokeWidth="3" 
              fill="none"/>
              <Tooltip triggerRef={reference[item.id]}>
                  <rect x={0} y={-35} width={this.calcTextWidth(item.relationship, "16pt arial")+29} height={35} rx={5} ry={5} fill='black'/>
                  <text x={15} y={-10} fontSize={"16pt"} fill='white'>{item.relationship}</text>
              </Tooltip>
            </React.Fragment>
            )
          )
        )});
      }


      calcTextWidth(text, font) {
        var canvas = this.calcTextWidth.canvas || (this.calcTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
      }      

      render() {
        return (
          <React.Fragment>
            <defs>
              {this.state.relationshipMarker}
            </defs>
            {this.state.relationship}
          </React.Fragment>
        );
      }
    }
    export default Relationship;