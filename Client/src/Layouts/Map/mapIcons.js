import soldierImage from '../../assets/icons/soldier.png';
import soldierEmerg from '../../assets/icons/soldierEmerg.png';
import commanderImage from '../../assets/icons/commander.png';
import commanderEmerg from '../../assets/icons/commanderEmerg.png';

export default function mapIcons(__icon) {
    var image;
    switch(__icon){
        case "soldierEmerg":
            image = soldierEmerg;
            break;
        case "commander":
            image = commanderImage;
            break;
        case "commanderEmerg":
            image = commanderEmerg;
            break;
        default:
            image = soldierImage;
    }
    return (
        {image}
    )
}
