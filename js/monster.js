//Eine Klasse die die Monster definiert
class Monster{
    constructor(tile, sprite, hp){
        this.move(tile);
        this.sprite = sprite;
        this.hp = hp;

        this.teleportCounter = 2;
    }

    heal(damage){
        this.hp = Math.min(maxHp, this.hp+damage);
    }

    update(){
        this.teleportCounter--;

        if(this.stunned || this.teleportCounter > 0){
            this.stunned = false;
            return;
        }

        this.doStuff();
    }

    doStuff(){
       let neighbors = this.tile.getAdjacentPassableNeighbors();
       
       neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer);

       if(neighbors.length){
           neighbors.sort((a,b) => a.dist(player.tile) - b.dist(player.tile));
           let newTile = neighbors[0];
           this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
       }
    }

    draw(){
        if(this.teleportCounter > 0){
            drawSprite(8, this.tile.x, this.tile.y,)
        }else{
            drawSprite(this.sprite, this.tile.x, this.tile.y);
            this.drawHp();
        }
    }

    drawHp(){
        for(let i=0; i<this.hp; i++){
            drawSprite(
                7,
                this.tile.x + (i%3)*(5/16),
                this.tile.y - Math.floor(i/3)*(5/16)
            );
        }
    }   

    tryMove(dx, dy){
        let newTile = this.tile.getNeighbor(dx,dy);
        if(newTile.passable){
            if(!newTile.monster){
                this.move(newTile);
            }else{
                if(this.isPlayer != newTile.monster.isPlayer){
                    this.attackedThisTurn = true;
                    newTile.monster.stunned = true;
                    newTile.monster.hit(1);
                }
            }
            return true;
        }
    }

    hit(damage){
        this.hp -= damage;
        if(this.hp <= 0){
            this.die();
        }
    }

    die(){
        this.dead = true;
        this.tile.monster = null;
        this.sprite = 1;
    }

    move(tile){
        if(this.tile){
            this.tile.monster = null;
        }
        this.tile = tile;
        tile.monster = this;
    }
}

//Neue Klasse für den Spieler
class Player extends Monster {
    constructor(tile) {
        super(tile, 0, 3);
        this.isPlayer = true;
        this.teleportCounter = 0;
    }

    //Methode die die Bewegung des Spielers prüft/möglich macht
    tryMove(dx, dy) {
        if(super.tryMove(dx, dy)) {
            tick();
        }
    }
}

//Neue Klasse für die Monster Schildkröte
class turtle extends Monster {
    constructor(tile) {
        super(tile, 5, 3);
    }

    update() {
        let startedStunned = this.stunned;
        super.update();
        if(!startedStunned) {
            this.stunned = true;
        }
    }
}

//Neue Klasse für die Monster Huhn
class chicken extends Monster {
    constructor(tile) {
        super(tile, 6, 1);
    }
}

//Neue Klasse für die Monster Schnecke
class snail extends Monster {
    constructor(tile) {
        super(tile, 4, 2);
    }
}

class snake extends Monster {
    constructor(tile) {
        super(tile, 8, 1);
    }

    doStuff() {
        this.attackedThisTurn = false;
        super.doStuff();

        if(!this.attackedThisTurn) {
            let neighbors = this.tile.getAdjacentPassableNeighbors();

            neighbors = neighbors.filter(t => t.monster && t.monster.isPlayer);

            if(neighbors.length) {
                this.doStuff();
            }
        }
    }
}

//Mehr Movement für monster einbauen