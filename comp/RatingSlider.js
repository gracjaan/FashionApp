import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import Slider from '@react-native-community/slider';

const RatingSlider = ({ postId }) => {
    const [rating, setRating] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [sum, setSum] = useState(0);
    const [divisor, setDivisor] = useState(0);

    // Fetch average rating from the database and update the state
    const fetchAverageRating = async () => {
        try {
            const postRef = firebase.firestore().collection('posts').doc(postId);
            const postDoc = await postRef.get();

            if (postDoc.exists) {
                const post = postDoc.data();
                const ratings = post.ratings || [];
                const sum = ratings.reduce((total, r) => total + r, 0);
                const average = ratings.length > 0 ? sum / ratings.length : 0;
                //setAverageRating(average);
                setSum(sum);
                setDivisor(ratings.length);
                setIsSubmitted(post.ratingsUID && post.ratingsUID.includes(firebase.auth().currentUser.uid));
            }
        } catch (error) {
            console.error('Error fetching average rating:', error);
        }
    };

    useEffect(() => {
        fetchAverageRating();
    }, [postId]);

    const submitRating = async () => {
        try {
            const postRef = firebase.firestore().collection('posts').doc(postId);
            await postRef.update({
                ratings: firebase.firestore.FieldValue.arrayUnion(rating),
                ratingsUID: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleRatingComplete = () => {
        submitRating();
    };

    return (
        <View>
            {!isSubmitted ? (
                <View>
                    <Slider
                        style={{ width: '100%', alignSelf: 'center' }}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        value={rating}
                        onValueChange={handleRatingChange}
                        onSlidingComplete={handleRatingComplete}
                        disabled={isSubmitted} // Disable the slider once the rating is submitted
                    />
                </View>
            ) : (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: 'white', fontSize: 15, fontFamily: 'Helvetica', fontWeight: 'bold', }}>average score: {(rating !== 0) ? ((sum + rating) / (divisor + 1)).toFixed(1) : ((sum + rating) / divisor).toFixed(1)}</Text>
                </View>
            )}
        </View>
    );
};

export default RatingSlider;
