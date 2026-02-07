// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PredictionMarket {
    struct Prediction {
        uint256 id;
        string homeTeam;
        string awayTeam;
        uint8 predictedWinner; // 0=home, 1=away, 2=draw
        uint8 confidence;
        uint256 timestamp;
        bool resolved;
        uint8 actualWinner;
    }
    
    mapping(uint256 => Prediction) public predictions;
    uint256 public predictionCount;
    uint256 public correctPredictions;
    
    event PredictionMade(
        uint256 indexed id,
        string homeTeam,
        string awayTeam,
        uint8 predictedWinner,
        uint8 confidence,
        uint256 timestamp
    );
    
    event PredictionResolved(
        uint256 indexed id,
        uint8 actualWinner,
        bool correct
    );
    
    function recordPrediction(
        string memory _home,
        string memory _away,
        uint8 _winner,
        uint8 _confidence
    ) external returns (uint256) {
        require(_winner <= 2, "Invalid winner");
        require(_confidence >= 50 && _confidence <= 99, "Confidence must be 50-99%");
        
        predictions[predictionCount] = Prediction({
            id: predictionCount,
            homeTeam: _home,
            awayTeam: _away,
            predictedWinner: _winner,
            confidence: _confidence,
            timestamp: block.timestamp,
            resolved: false,
            actualWinner: 0
        });
        
        emit PredictionMade(
            predictionCount,
            _home,
            _away,
            _winner,
            _confidence,
            block.timestamp
        );
        
        predictionCount++;
        return predictionCount - 1;
    }
    
    function resolvePrediction(uint256 _id, uint8 _actualWinner) external {
        require(_id < predictionCount, "Prediction doesn't exist");
        require(!predictions[_id].resolved, "Already resolved");
        require(_actualWinner <= 2, "Invalid winner");
        
        predictions[_id].resolved = true;
        predictions[_id].actualWinner = _actualWinner;
        
        bool correct = predictions[_id].predictedWinner == _actualWinner;
        if (correct) {
            correctPredictions++;
        }
        
        emit PredictionResolved(_id, _actualWinner, correct);
    }
    
    function getPrediction(uint256 _id) external view returns (Prediction memory) {
        require(_id < predictionCount, "Prediction doesn't exist");
        return predictions[_id];
    }
    
    function getAccuracy() external view returns (uint256) {
        if (predictionCount == 0) return 0;
        return (correctPredictions * 100) / predictionCount;
    }
    
    function getAllPredictions() external view returns (Prediction[] memory) {
        Prediction[] memory allPredictions = new Prediction[](predictionCount);
        for (uint256 i = 0; i < predictionCount; i++) {
            allPredictions[i] = predictions[i];
        }
        return allPredictions;
    }
}