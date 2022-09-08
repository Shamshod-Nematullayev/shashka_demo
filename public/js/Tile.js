
  function Tile(element, position) {
    //linked DOM element
    this.element = element;
    //position in gameboard
    this.position = position;
    //if tile is in range from the piece
    this.inRange = function (piece) {
      for (let k of pieces)
        if (k.position[0] == this.position[0] && k.position[1] == this.position[1]) return 'wrong';

      let abbr = Math.floor(dist(this.position[0], this.position[1], piece.position[0], piece.position[1]))
      if ( abbr == floor(1)  && !piece.king) {
        //regular move
        return 'regular';
      } else if (abbr == floor(2) && !piece.king) {
        //jump move
        return 'jump';
      } else if ((abbr ==  floor(1) || abbr ==  floor(2) || abbr ==  floor(3) || abbr == floor(4) || abbr == floor(5) || abbr == floor(6) || abbr == floor(7))&& piece.king ){
        return "fly"
      }
    };
    this.inRangeOn = function (piece) {
      for (let k of pieces)
        if (k.oldPlace[0] == this.position[0] && k.oldPlace[1] == this.position[1]) return 'wrong';

      let abbr = Math.floor(dist(this.position[0], this.position[1], piece.position[0], piece.position[1]))
      if ( abbr == floor(1)  && !piece.king) {
        //regular move
        return 'regular';
      } else if (abbr == floor(2) && !piece.king) {
        //jump move
        return 'jump';
      } else if ((abbr ==  floor(1) || abbr ==  floor(2) || abbr ==  floor(3) || abbr == floor(4) || abbr == floor(5) || abbr == floor(6) || abbr == floor(7))&& piece.king ){
        return "fly"
      }
    };
    function floor(i){
      return Math.floor(i * Math.sqrt(2))
    }
  }