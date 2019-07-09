/* @Author Lerk
 *
 * Guardian Statue - Sharenian: Fountain of the Wiseman (990000500)
 * 
 * Guild Quest Stage 3
 */

function start() {
    //everything can be done in one status, so let's do it here.
    var eim = cm.getEventInstance();
    if (eim == null) {
	cm.warp(990001100);
    } else {
	if (eim.getProperty("leader").equals(cm.getName())) {
	    if (cm.getMap().getReactorByName("watergate").getState() > 0){
		cm.sendOk("����Լ�����");
	    } else {
		var currentCombo = eim.getProperty("stage3combo");
		if (currentCombo == null || currentCombo.equals("reset")) {
		    var newCombo = makeCombo();
		    eim.setProperty("stage3combo",newCombo);
		    //cm.playerMessage("Debug: " + newCombo);
		    eim.setProperty("stage3attempt","1");
		    cm.sendOk("�����Ȫ����������ͨ���ı����ҡ������������Ʒ���жԻ�����������������Ʒ�Ƿ���ȷ��������ǣ�����ܲ����ˡ������ߴλ��ᡣף����ˡ�");
		} else {
		    var attempt = parseInt(eim.getProperty("stage3attempt"));
		    var combo = parseInt(currentCombo);
		    var guess = getGroundItems();
		    if (guess != null) {
			if (combo == guess) {
			    cm.getMap().getReactorByName("watergate").hitReactor(cm.getC());
			    cm.sendOk("You may proceed.");
			    cm.showEffect(true, "quest/party/clear");
			    cm.playSound(true, "Party1/Clear");
			    var prev = eim.setProperty("stage3clear","true",true);
			    if (prev == null) {
				cm.gainGP(1500);
			    }
			} else {
			    if (attempt < 7) {
				//cm.playerMessage("Combo : " + combo);
				//cm.playerMessage("Guess : " + guess);
				var parsedCombo = parsePattern(combo);
				var parsedGuess = parsePattern(guess);
				var results = compare(parsedCombo, parsedGuess);
				var string = "";
				//cm.playerMessage("Results - Correct: " + results[0] + " | Incorrect: " + results[1] + " | Unknown: " + results[2]);
				if (results[0] != 0) {
				    if (results[0] == 1) {
					string += "1 ���е��ܸ�������������Ҫ�Ĺ�Ʒ��\r\n";
				    } else {
					string += results[0] + " Ҳ�ܸ��������ǽ��ס�\r\n";
				    }
				}
				if (results[1] != 0) {
				    if (results[1] == 1) {
					string += "1 ������յ�����ȷ�Ĺ�Ʒ��\r\n";
				    } else {
					string += results[1] + " ����Ѿ��յ�����ȷ�Ĺ�Ʒ��\r\n";
				    }
				}
				if (results[2] != 0) {
				    if (results[2] == 1) {
					string += "1 ������յ�δ֪�Ĺ�Ʒ��\r\n";
				    } else {
					string += results[2] + " ����յ�δ֪�Ĺ�Ʒ��\r\n";
				    }
				}
				string += "������� ";
				switch (attempt) {
				    case 1:
					string += "��һ��";
					break;
				    case 2:
					string += "�ڶ���";
					break;
				    case 3:
					string += "������";
					break;
				    default:
					string += attempt + "��";
					break;
				}
				string += " ���ԡ�";

				//spawn one black and one myst knight
				cm.spawnMob(9300036, -350, 150);
				cm.spawnMob(9300037, 400, 150);

				cm.sendOk(string);
				eim.setProperty("stage3attempt",attempt + 1);
			    } else {
				//reset the combo and mass spawn monsters
				eim.setProperty("stage3combo","reset");
				cm.sendOk("��ʧ���ˣ�������һ�Ρ�");

				for (var i = 0; i < 5; i++) {
				    //keep getting new monsters, lest we spawn the same monster five times o.o!
					cm.spawnMob(9300036, randX(), 150);
					cm.spawnMob(9300037, randX(), 150);
				}
			    }
			}
		    } else {
			cm.sendOk("��ȷ����Ķ�������Ʒ��ȷ�����������ǰ���ٺ���˵����");
		    }
		}
	    }
	} else {
	    cm.sendOk("������Ķӳ�����˵����");
	}
    }
    cm.dispose();
}

function action(mode, type, selection) {
}

function makeCombo() {
    var combo = 0;
        
    for (var i = 0; i < 4; i++) {
	combo += Math.floor(Math.random() * 4) * Math.pow(10, i);
    }
        
    return combo;
}

//check the items on ground and convert into an applicable string; null if items aren't proper
function getGroundItems() {
    var items = cm.getMap().getItemsInRange(cm.getPlayer().getPosition(), java.lang.Double.POSITIVE_INFINITY);
    var itemInArea = new Array(-1, -1, -1, -1);
        
    if (items.size() != 4) {
	cm.playerMessage("��ͼ����̫�����Ʒ��������һЩ��");
	return null;
    }
        
    var iter = items.iterator();
    while (iter.hasNext()) {
	var item = iter.next();
	var id = item.getItem().getItemId();
	if (id < 4001027 || id > 4001030) {
	    cm.playerMessage("�ڵ�ͼ�е�һЩ��Ʒ���������4����Ʒ��һ���֡�");
	    return null;
	} else {
	    //check item location
	    for (var i = 0; i < 4; i++) {
		if (cm.getMap().getArea(i).contains(item.getPosition())) {
		    itemInArea[i] = id - 4001027;
		    //cm.playerMessage("Item in area "+i+": " + id);
		    break;
		}
	    }
	}
    }
        
    //guaranteed four items that are part of the stage 3 item set by this point, check to see if each area has an item
    if (itemInArea[0] == -1 || itemInArea[1] == -1 || itemInArea[2] == -1 || itemInArea[3] == -1) {
	cm.playerMessage("�����Щ������ȷ��λ��: " + (itemInArea[0] == -1 ? "���� 1, " : "") + (itemInArea[1] == -1 ? "���� 2, " : "") + (itemInArea[2] == -1 ? "���� 3, " : "") + (itemInArea[3] == -1 ? "���� 4. " : ""));
              /*  for (var i = 0; i < 4; i++) {
                        cm.playerMessage("Item in area "+i+": " + itemInArea[i]);
                }*/
	return null;
    }
        
    return (itemInArea[0] * 1000 + itemInArea[1] * 100 + itemInArea[2] * 10 + itemInArea[3]);
}

//convert an integer for answer or guess into int array for comparison
function parsePattern(pattern) {
    var tempPattern = pattern;
    var items = new Array(-1, -1, -1, -1);
    for (var i = 0; i < 4; i++) {
	items[i] = Math.floor(tempPattern / Math.pow(10, 3-i));
	tempPattern = tempPattern % Math.pow(10, 3-i);
    }
    return items;
}

// compare two int arrays for the puzzle
function compare(answer, guess) {
    var correct = 0;
    var incorrect = 0;
    /*var debugAnswer = "Combo : ";
        var debugGuess = "Guess : ";
        
        for (var d = 0; d < answer.length; d++) {
                debugAnswer += answer[d] + " ";
                debugGuess += guess[d] + " ";
        }
        
        cm.playerMessage(debugAnswer);
        cm.playerMessage(debugGuess);*/
        
    for (var i = 0; i < answer.length; i) {
	if (answer[i] == guess[i]) {
	    correct++;
	    //cm.playerMessage("Item match : " + answer[i]);
                        
	    //pop the answer/guess at i
	    if (i != answer.length - 1) {
		answer[i] = answer[answer.length - 1];
		guess[i] = guess[guess.length - 1];
	    }
                        
	    answer.pop();
	    guess.pop();
                        
	/*/debugAnswer = "Combo : ";
                        debugGuess = "Guess : ";

                        for (var d = 0; d < answer.length; d++) {
                                debugAnswer += answer[d] + " ";
                                debugGuess += guess[d] + " ";
                        }

                        cm.playerMessage(debugAnswer);
                        cm.playerMessage(debugGuess);*/
	}
	else {
	    i++;
	}
    }
        
    //check remaining answers for "incorrect": correct item in incorrect position
    var answerItems = new Array(0, 0, 0, 0);
    var guessItems = new Array(0, 0, 0, 0);
        
    for (var j = 0; j < answer.length; j++) {
	var aItem = answer[j];
	var gItem = guess[j]
	answerItems[aItem]++;
	guessItems[gItem]++;
    }
        
    /*for (var d = 0; d < answer.length; d++) {
                cm.playerMessage("Item " + d + " in combo: " + answerItems[d] + " | in guess: " + guessItems[d]);
        }*/
        
    for (var k = 0; k < answerItems.length; k++) {
	var inc = Math.min(answerItems[k], guessItems[k]);
	//cm.playerMessage("Incorrect for item " + k + ": " + inc);
	incorrect += inc;
    }
        
    return new Array(correct, incorrect, (4 - correct - incorrect));
}

//for mass spawn
function randX() {
    return -350 + Math.floor(Math.random() * 750);
}