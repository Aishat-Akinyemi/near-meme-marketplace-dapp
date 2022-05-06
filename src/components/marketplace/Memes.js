import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddMeme from "./AddMeme";
import Meme from "./Meme";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";

import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getMemes as getMemeList,
  buyMeme,
  voteMeme 
} from "../../utils/marketplace";

import {  
  createMemeRecordOnIPFS
} from "../../utils/ipfs"

const Memes = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(false);

  // function to get the list of memes
  const getMemes = useCallback(async () => {
    try {
      setLoading(true);
      setMemes(await getMemeList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addMeme = async (data) => {
    try {      
      setLoading(true);
      createMemeRecordOnIPFS(data).then((resp) => {
        getMemes();
      });
      toast(<NotificationSuccess text="Meme added successfully." />);
    } catch (error) {
      toast(<NotificationError text="Failed to create a meme." />);
    } finally {
      setLoading(false);
    }
  };

  //  function to initiate transaction
  const buy = async (id, price) => {
    try {
      await buyMeme({
        id,
        price,
      }).then((resp) => getMemes());
      toast(<NotificationSuccess text="Meme bought successfully" />);
    } catch (error) {
      toast(<NotificationError text="Failed to purchase meme." />);
    } finally {
      setLoading(false);
    }
  };

  // function to vote for a meme
  const voteMemeItem = async (id, voteType) => {
    try{
      await voteMeme({
        id, 
        voteType,
      }).then((resp) => getMemes());
      toast(<NotificationSuccess text= {(voteType == 0)? "Meme downvoted" : "Meme upvoted"} />);
    } catch (error) {
      toast(<NotificationError text={`Error voting meme, have you voted before?`} />);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    getMemes();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Memes</h1>
            <AddMeme save={addMeme} />
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {memes.map((_meme) => (
              <Meme
                meme={{
                  ..._meme,
                }}
                buy={buy}
                vote={voteMemeItem}
              />
            ))}
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Memes;
