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

      // calculate side centers w/ direction for 2 given person containers
      calcSideCenters(first, second){
        var nav;
        try{
          nav = document.getElementById("nav").getBoundingClientRect().height - 5; // get height of nav bar
        }
        catch(TypeError){
          nav = 30;
        }

        var relationshipPoints = { // contains side centers for 2 give person containers
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

        // if first person is under second person
        if(relationshipPoints.top[0].y > relationshipPoints.bottom[1].y + 10){
          x1Temp = relationshipPoints.top[0].x + 5;
          y1Temp = relationshipPoints.top[0].y + nav + 10;
          x2Temp = relationshipPoints.bottom[1].x + 5;
          y2Temp = relationshipPoints.bottom[1].y + nav + 20;
        }
        // if first person is above second person
        else if(relationshipPoints.bottom[0].y < relationshipPoints.top[1].y - 10){
          x1Temp = relationshipPoints.bottom[0].x + 5;
          y1Temp = relationshipPoints.bottom[0].y + nav + 5;
          x2Temp = relationshipPoints.top[1].x + 5;
          y2Temp = relationshipPoints.top[1].y + nav;
        }
        // if first person is on the left of second person
        else if(relationshipPoints.right[0].x < relationshipPoints.left[1].x){
          x1Temp = relationshipPoints.right[0].x + 5;
          y1Temp = relationshipPoints.right[0].y + nav + 5;
          x2Temp = relationshipPoints.left[1].x + 5;
          y2Temp = relationshipPoints.left[1].y + nav + 5;
          horizontalTemp = true;
        }
        // if first person is on the right of second person
        else if(relationshipPoints.left[0].x > relationshipPoints.right[1].x){
          x1Temp = relationshipPoints.left[0].x + 5;
          y1Temp = relationshipPoints.left[0].y + nav + 5;
          x2Temp = relationshipPoints.right[1].x + 5;
          y2Temp = relationshipPoints.right[1].y + nav + 5;
          horizontalTemp = true;
        }
        // if first person is on second person and vice versa
        else{
          x1Temp = relationshipPoints.mid[0].x;
          y1Temp = relationshipPoints.mid[0].y;
          x2Temp = relationshipPoints.mid[0].x;
          y2Temp = relationshipPoints.mid[0].y;
        }

        return {x1: x1Temp, y1: y1Temp, x2: x2Temp, y2: y2Temp, horizontal: horizontalTemp};
      }

      // renders given relationship
      renderRelationship(){
        var relationshipPairList = [];

        var first = (this.props.personClassCoordinates.filter(el => parseInt(el.id) === parseInt(this.props.relationship.id_1)))[0]; // get 1st person coordinates
        var second = (this.props.personClassCoordinates.filter(el => parseInt(el.id) === parseInt(this.props.relationship.id_2)))[0];// get 2nd person coordinates

        var sideCoords = this.calcSideCenters(first, second); // calculate proper side coords for this pair of persons

        // connection between persons has sharp edges, so you need 4 coords; it support horizontal positioning as well
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
          id: this.props.relationship.id,
          relationship: this.props.relationship.relationships,
          id1: first.id, id2: second.id, 
          color: this.props.relationship.color,
          points: pointsTemp,
          horizontal: sideCoords.horizontal,
        });

        var reference = React.createRef(); // reference to relationship for Toolitp (relationship name on hover)

        this.setState({
          relationshipMarker: (relationshipPairList.map(item => ( // marker - arrow at the end of relationship
            <marker 
            id={'head_' + item.color.substring(1)} 
            key={'head_' + item.color.substring(1)} 
            orient="auto"
            markerWidth='6' markerHeight='6'
            refX={item.horizontal ? '3.2' : '0.1'} refY='3'
            >
              <path d='M0,0 V6 L3,3 Z' fill={item.color} stroke={item.color}/>
            </marker>
          ))),
          relationship: (relationshipPairList.map(item => ( // relationship
            <React.Fragment
            key={"fragment_" + item.id1 + "_" + item.id2}
            >
              <polyline 
              ref={reference}
              id={"path_" + item.id1 + "_" + item.id2}
              markerEnd={'url(#head_' + item.color.substring(1) + ')'}
              points={item.points} 
              stroke = {item.color}
              strokeWidth="3" 
              fill="none"/>
              {/* Relationship name on connection hover */}
              <Tooltip triggerRef={reference}>
                  <rect x={0} y={-35} width={this.calcTextWidth(item.relationship, "16pt arial") + 29} height={35} rx={5} ry={5} fill='black'/>
                  <text x={15} y={-10} fontSize={"16pt"} fill='white'>{item.relationship}</text>
              </Tooltip>
            </React.Fragment>
            )
          )
        )});
      }

      // calculate the text width for Tooltip Component, by using text length (relationship name on hover)
      calcTextWidth(text, font) {
        try{
          var canvas = this.calcTextWidth.canvas || (this.calcTextWidth.canvas = document.createElement("canvas"));
          var context = canvas.getContext("2d");
          context.font = font;
          var metrics = context.measureText(text);
          return metrics.width;
        }
        catch(TypeError){
          return 30;
        }
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