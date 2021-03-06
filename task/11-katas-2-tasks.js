'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 *
 *   Truth table:
 *
 *   _ a _
 *   f g b
 *   e d c
 *
 *   0 => abcdefg => 1111110
 *   ...
 */
function parseBankAccount(bankAccount) {
    const offset = bankAccount.indexOf('\n');
    const row2 = offset + 1;
    const row3 = offset * 2 + 2;
    const binaryDigits = [];

    const truthTable = {
        '1111110': 0,
        '0110000': 1,
        '1101101': 2,
        '1111001': 3,
        '0110011': 4,
        '1011011': 5,
        '1011111': 6,
        '1110000': 7,
        '1111111': 8,
        '1111011': 9
    };

    for (let i = 0; i < offset; i += 3) {
        const digit = [i + 1, row2 + i + 2, row3 + i + 2,
        row3 + i + 1, row3 + i, row2 + i, row2 + i + 1];
        const binaryDigitStr = digit.map(x => +(bankAccount[x] !== ' ')).join('');
        binaryDigits.push(binaryDigitStr);
    }

    return +binaryDigits.map(x => truthTable[x]).join('');
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    const words = text.split(' ');
    let current = words[0];
    for (let word of words.slice(1)) {
        if (current.length + 1 + word.length > columns) {
            yield current;
            current = word;
        } else {
            current += ` ${word}`;
        }
    }
    yield current;
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {

    const DenominationMap = {
        '2': 2, '3': 3, '4': 4,
        '5': 5, '6': 6, '7': 7,
        '8': 8, '9': 9, '10': 10,
        'J': 11, 'Q': 12, 'K': 13,
        'A': 14
    };

    const SuitMap = {
        '♠': 0, '♥': 1, '♦': 2, '♣': 3
    }

    const incProp = (obj, prop) => {
        if (obj[prop]) {
            obj[prop] += 1;
        } else {
            obj[prop] = 1;
        }
    };

    const normalizeHand = hand => {
        const result = hand.reduce((hand, card) => {
            const [d, s] = [DenominationMap[card.slice(0, -1)], SuitMap[card.slice(-1)]];
            incProp(hand.denominations, d);
            incProp(hand.suits, s);
            hand.sortedDenominations.push(d);
            return hand;
        }, { sortedDenominations: [], denominations: [], suits: [] });
        result.sortedDenominations.sort((a, b) => a - b);
        if (result.denominations['14'] && result.denominations['2']) { // low Ace
            result.sortedDenominations.unshift(1);
            result.sortedDenominations.pop();
        }
        return result;
    };

    const hasCountOfKind = (hand, count, matchesCount) => {
        if (!matchesCount) {
            return hand.denominations.some(c => c === count);
        }
        return hand.denominations.reduce((r, c) => (c === count) ? r + 1 : r, 0) === matchesCount;
    };

    const isStraight = hand => {
        const sortedHand = hand.sortedDenominations;
        for (let i = 0; i < sortedHand.length - 1; ++i) {
            if (sortedHand[i + 1] - sortedHand[i] !== 1) {
                return false;
            }
        }
        return true;
    };

    const isFlush = hand => hand.suits.some(count => count === 5);

    const rankPredicates = new Map([
        [PokerRank.StraightFlush, hand => isFlush(hand) && isStraight(hand)],
        [PokerRank.FourOfKind, hand => hasCountOfKind(hand, 4)],
        [PokerRank.FullHouse, hand => hasCountOfKind(hand, 2) && hasCountOfKind(hand, 3)],
        [PokerRank.Flush, isFlush],
        [PokerRank.Straight, isStraight],
        [PokerRank.ThreeOfKind, hand => hasCountOfKind(hand, 3)],
        [PokerRank.TwoPairs, hand => hasCountOfKind(hand, 2, 2)],
        [PokerRank.OnePair, hand => hasCountOfKind(hand, 2)],
        [PokerRank.HighCard, _ => true]
    ]);

    const nHand = normalizeHand(hand);
    for (let [rank, pred] of rankPredicates.entries()) {
        if (pred(nHand)) {
            return rank;
        }
    }
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 *
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 *
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
    throw new Error('Not implemented');
}


module.exports = {
    parseBankAccount: parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
