import React from "react";
import PropTypes from "prop-types";
import { utils } from "near-api-js";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";

const Meme = ({ meme, buy, vote }) => {
  const { id, price, name, description, sold, location, image, owner, upvotes_count, downvotes_count } =
    meme;

  const triggerBuy = () => {
    buy(id, price);
  };

  const triggerVote = (voteType) => {
    vote(id, voteType);
  };

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <span className="font-monospace text-secondary">{owner}</span>  

            <button type="button" class="btn btn-success position-relative btn-xs ms-auto"  onClick={() => triggerVote(1)}>
              <i class="bi bi-hand-thumbs-up-fill"></i>
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
               {upvotes_count}            
              </span>
            </button>

            <button type="button" class="btn btn-danger position-relative btn-xs ms-auto" onClick={() => triggerVote(0)}>
              <i class="bi bi-hand-thumbs-down-fill"></i>
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
               {downvotes_count}            
              </span>
            </button>

            <Badge bg="secondary" className="ms-auto">
              {sold} Sold
            </Badge>
          </Stack>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src={image} alt={name} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{name}</Card.Title>
          <Card.Text className="flex-grow-1 ">{description}</Card.Text>
          <Card.Text className="text-secondary">
            <span>{location}</span>
          </Card.Text>          
          <Button
            variant="outline-dark"
            onClick={triggerBuy}
            className="w-100 py-3"
          >
            Buy for {utils.format.formatNearAmount(price)} NEAR
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

Meme.propTypes = {
  meme: PropTypes.instanceOf(Object).isRequired,
  buy: PropTypes.func.isRequired,
  vote : PropTypes.func.isRequired,
};

export default Meme;
