//@flow

import * as React from "react";
import Card from "../Card/Card.react";
import Text from "../Text/Text.react";
import Button from "../Button/Button.react";
import Icon from "../Icon/Icon.react";

type Props = {|
  +children?: React.Node,
  +title?: string,
  +price?: string,
  +subtitle?: string,
  +imgUrl?: string,
  +imgAlt?: string,
  +buttonUrl?: string,
  +buttonTitle?: string,
|};

function StoreCard({
  children,
  title,
  subtitle,
  price,
  imgUrl,
  imgAlt,
  buttonUrl,
  buttonTitle,
}: Props): React.Node {
  return (
    <Card>
      <Card.Body>
        <div className="mb-4 text-center">
          <img src={imgUrl} alt={imgAlt} />
        </div>
        <Card.Title>{title}</Card.Title>
        <Text className="card-subtitle">{subtitle}</Text>

        <div className="mt-5 d-flex align-items-center">
          <div className="product-price">
            <strong>{price}</strong>
          </div>
          <div className="ml-auto">
            <Button 
            color="primary"
            to={buttonUrl}
            >
              {buttonTitle}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default StoreCard;
