import Phaser from 'phaser';
import {GameScene} from './GameScene';
import {installRadioKlandestina} from './radioKlandestina';
import './style.css';

new Phaser.Game({
 type:Phaser.AUTO,
 parent:'game',
 width:1280,
 height:720,
 backgroundColor:'#12131a',
 scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},
 render:{pixelArt:false,antialias:true},
 scene:[GameScene]
});
installRadioKlandestina();
