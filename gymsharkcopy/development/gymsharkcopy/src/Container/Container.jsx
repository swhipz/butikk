import Header from "../components/Header/Header";
import CTAMEN from "../components/CTA/CTAMEN";
import CTAWOMEN from "../components/CTA/CTAWOMEN";
import Supersale from "../components/Supersale/Supersale";
import Mainhero from "../components/Mainhero/Mainhero";
import Packs from "../components/Packs/Packs";




const Container = () => {
    return(
    <>
    <Header />
    <Supersale />
    <Mainhero />
    <Packs />
    </>
    );

}
export default Container;