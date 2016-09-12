var player;

var debug = false;

var executed = false;

var playlistId = '';

var toDownload = -1;

var downloaded = 0;

var allItems = [];

var yt_api_url = 'https://www.googleapis.com/youtube/v3/playlistItems';

$(function(){

  if (debug) {
    turnDebugOn();
  }

  $('#playlist-id').find('input[type=button]').click(function(){
    playlistId = $('#id-field').val();
    loadList();
  });

});

function turnDebugOn() {
  $('#links').show();
}

function message(text){
  $('#status').text(text);
}

function reset() {
  toDownload = -1; 
  executed = false;
  allItems = [];
  message('');
  $('#playlist-id').show();
  $('#id-field').val('');
  playlistId = '';
}

function loadList(index){
  $('#playlist-id').hide();
  message('Carregando...');

  params = {
    part: 'contentDetails',
    maxResults: 50,
    playlistId: playlistId,
    key: yt_api_key
  }

  if (index) {
    params.pageToken = index;
  }

  $.get(yt_api_url, params, function(data) {
    if (data.items) {

      var list = data.items;

      for(var i = 0; i < list.length; i++) {
        allItems.push(list[i].contentDetails.videoId);
      }

      if (data.pageInfo.totalResults > allItems.length) {
        loadList(data.nextPageToken);
        return;
      }

      toDownload = allItems.length;
      downloaded = 0;
      message(toDownload+ ' vídeos encontrados. Fazendo download...');
      baixaTudo(allItems);
    }
  }, 'json');
}

function baixaTudo(list){
  $.each(list, function(i, obj){
    pushItem(obj);
  });
}

function pushItem(id) {
  var d = new Date();
  var ytUrl = 'http://www.youtube.com/watch?v=' + id;
  var ytmp3Url = 'http://www.youtube-mp3.org/a/pushItem/';

  var url = ytmp3Url + '?item=' + escape(ytUrl) + '&el=ma&bf=' + tretaBF() + '&r=' + d.getTime();
  url = tretar_url(url);

  $.get(url, '', function(data){
    itemInfo(data);
  });
}

function itemInfo(id) {
  var d = new Date();
  var ytmp3Url = 'http://www.youtube-mp3.org/a/itemInfo/';

  var url = ytmp3Url + '?video_id=' + id + '&ac=www&t=grp&r=' + d.getTime();
  url = tretar_url(url);

  $.get(url, '', function(data){
    download(id, data);
  });

}

function download(id, data){
  var info;
  eval(data);

  var link = 'http://www.youtube-mp3.org/get';

  link += '?video_id=' + id;
  link += '&ts_create=' + info.ts_create ;
  link += '&r=' + info.r;
  link += '&h2=' + info.h2;
  link = tretar_url(link);

  a = $('<a />')
  a.attr('href', link);
  a.text(id);

  $('#links').append(a).append('<br>');

  chrome.downloads.download({
    url: link
  });

  downloaded++;

  if (downloaded == toDownload) {
    reset();
  }
}

// These functions were copy pasted from youtube-mp3 website.
// They are used to add the 's' variable in url requests that works like a verification digit
// I changed their names and one or two lines to make it work outside of youtube-mp3 site.

function tretaBF() {
  return 'false';
}


function tretar_url(a) {
    var c = tretar(a);
    return a + "&s=" + escape(c)
}

tretar = function(a) {
  if ("function" == typeof _tretar) {
      var c = "X";
      try {
          c = _tretar(a)
      } catch (d) {}
      if ("X" != c)
          return c
  }
  return "-1"
}

var b0I = {
  'V': function(I, B, P) {
      return I * B * P;
  },
  'D': function(I, B) {
      return I < B;
  },
  'E': function(I, B) {
      return I == B;
  },
  'B3': function(I, B) {
      return I * B;
  },
  'G': function(I, B) {
      return I < B;
  },
  'v3': function(I, B) {
      return I * B;
  },
  'I3': function(I, B) {
      return I in B;
  },
  'C': function(I, B) {
      return I % B;
  },
  'R3': function(I, B) {
      return I * B;
  },
  'O': function(I, B) {
      return I % B;
  },
  'Z': function(I, B) {
      return I < B;
  },
  'K': function(I, B) {
      return I - B;
  }
};

function _tretar(H) {
    var U = "R3"
      , m3 = "round"
      , e3 = "B3"
      , D3 = "v3"
      , N3 = "I3"
      , g3 = "V"
      , K3 = "toLowerCase"
      , n3 = "substr"
      , z3 = "Z"
      , d3 = "C"
      , P3 = "O"
      , x3 = ['a', 'c', 'e', 'i', 'h', 'm', 'l', 'o', 'n', 's', 't', '.']
      , G3 = [6, 7, 1, 0, 10, 3, 7, 8, 11, 4, 7, 9, 10, 8, 0, 5, 2]
      , M = ['a', 'c', 'b', 'e', 'd', 'g', 'm', '-', 's', 'o', '.', 'p', '3', 'r', 'u', 't', 'v', 'y', 'n']
      , X = [[17, 9, 14, 15, 14, 2, 3, 7, 6, 11, 12, 10, 9, 13, 5], [11, 6, 4, 1, 9, 18, 16, 10, 0, 11, 11, 8, 11, 9, 15, 10, 1, 9, 6]]
      , A = {
        "a": 870,
        "b": 906,
        "c": 167,
        "d": 119,
        "e": 130,
        "f": 899,
        "g": 248,
        "h": 123,
        "i": 627,
        "j": 706,
        "k": 694,
        "l": 421,
        "m": 214,
        "n": 561,
        "o": 819,
        "p": 925,
        "q": 857,
        "r": 539,
        "s": 898,
        "t": 866,
        "u": 433,
        "v": 299,
        "w": 137,
        "x": 285,
        "y": 613,
        "z": 635,
        "_": 638,
        "&": 639,
        "-": 880,
        "/": 687,
        "=": 721
    }
      , r3 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    gs = function(I, B) {
        var P = "D"
          , J = "";
        for (var R = 0; b0I[P](R, I.length); R++) {
            J += B[I[R]];
        }
        ;return J;
    }
    ;
    ew = function(I, B) {
        var P = "K"
          , J = "indexOf";
        return I[J](B, b0I[P](I.length, B.length)) !== -1;
    }
    ;
    gh = function() {
        var I = gs(G3, x3);
        // return eval(I);
        // This function has the only objective to eval I that gets 'location.hostname' from gs().
        // So, it worked only in youtube-mp3 site. Not anymore... :D
        return 'www.youtube-mp3.org';
    }
    ;
    fn = function(I, B) {
        var P = "E"
          , J = "G";
        for (var R = 0; b0I[J](R, I.length); R++) {
            if (b0I[P](I[R], B))
                return R;
        }
        return -1;
    }
    ;
    var L = [1.23413, 1.51214, 1.9141741, 1.5123114, 1.51214, 1.2651]
      , F = 1;
    try {
        F = L[b0I[P3](1, 2)];
        var W = gh()
          , S = gs(X[0], M)
          , T = gs(X[1], M);
        if (ew(W, S) || ew(W, T)) {
            F = L[1];
        } else {
            F = L[b0I[d3](5, 3)];
        }
    } catch (I) {}
    ;var N = 3219;
    for (var Y = 0; b0I[z3](Y, H.length); Y++) {
        var Q = H[n3](Y, 1)[K3]();
        if (fn(r3, Q) > -1) {
            N = N + (b0I[g3](parseInt(Q), 121, F));
        } else {
            if (b0I[N3](Q, A)) {
                N = N + (b0I[D3](A[Q], F));
            }
        }
        N = b0I[e3](N, 0.1);
    }
    N = Math[m3](b0I[U](N, 1000));
    return N;
}