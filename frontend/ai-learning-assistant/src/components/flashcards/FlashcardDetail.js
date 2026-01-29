import { useState, useEffect } from "react";
import { toast } from "react- hot-toast";
import Spinner from "../common/Spinner";
import Button from "../../components/common/Button"
import flashcardService from "../../services/flashcardService";
import Button from "../../components/common/Button";

export const FlashcardDeatil = ({ card }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await flashcardService.togal(documentId);
                setData(res.data);
            } catch {
                toast.error("Failed to load flashcards");
            } finally {
                setLoading(false);
            }
        };
       fetch();
    }, []);

    const handleShow = ()=>{
        setShowAnswer(true);
        try{
            await flashcardService.reviewFlashcard(currentIndex._id);
            
        }catch(error){
            toast.error("Fali to featch the Card");

        }
    }




}