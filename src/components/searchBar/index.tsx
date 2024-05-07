"use client";

import pb from "@/pocketbase";
import { Arrangement, Artist, Collections, List, Piece, WithExpand } from "@/types";
import getArtistLifetimeString from "@/utils/getArtistLifetimeString";
import pluralize from "@/utils/pluralize";
import { LibraryMusic, List as ListIcon, MusicNote, Person } from "@mui/icons-material";
import {
  Paper,
  Portal,
  TextField,
  List as MuiList,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  debounce,
} from "@mui/material";
import {
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";

type Types = "artists" | "pieces" | "arrangements" | "lists";

interface Result {
  id: string;
  title: string;
  subtitle?: string;
  type: Types;
  original: Artist | Piece | Arrangement | List;
}

const iconMap: { [key in Types]: JSX.Element } = {
  artists: <Person />,
  lists: <ListIcon />,
  arrangements: <LibraryMusic />,
  pieces: <MusicNote />,
};

const baseUrlMap: { [key in Types]: string } = {
  artists: "/artist",
  lists: "/list",
  arrangements: "/arrangement",
  pieces: "/piece",
};

const SearchBar: React.FC = () => {
  const [types, setTypes] = useState<Types[]>(["artists", "lists", "pieces", "arrangements"]);
  const [allResults, setAllResults] = useState<Result[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const textFieldRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchResults: FocusEventHandler<HTMLInputElement> = async (evt) => {
    let results: Result[] = [];

    if (types.includes("artists")) {
      results.push(
        ...(await pb.collection(Collections.Artists).getFullList<Artist>()).map<Result>((artist) => {
          return {
            id: artist.id,
            title: artist.name,
            subtitle: getArtistLifetimeString(artist.born, artist.died),
            type: "artists",
            original: artist,
          };
        })
      );
    }
    if (types.includes("lists")) {
      results.push(
        ...(await pb.collection(Collections.Lists).getFullList<List>()).map<Result>((list) => {
          return {
            id: list.id,
            title: list.name,
            subtitle: `${list.arrangements.length} ${pluralize("Item", list.arrangements.length)}`,
            type: "lists",
            original: list,
          };
        })
      );
    }
    if (types.includes("pieces")) {
      results.push(
        ...(
          await pb
            .collection(Collections.Pieces)
            .getFullList<WithExpand<Piece, { composers: Artist[] }>>({ expand: "composers" })
        ).map<Result>((piece) => {
          return {
            id: piece.id,
            title: piece.title,
            subtitle: piece.expand.composers.map((composer) => composer.name).join(", "),
            type: "pieces",
            original: piece,
          };
        })
      );
    }
    if (types.includes("arrangements")) {
      results.push(
        ...(
          await pb
            .collection(Collections.Arrangements)
            .getFullList<
              WithExpand<Arrangement, { piece: WithExpand<Piece, { composers: Artist[] }>; arrangers: Artist[] }>
            >({
              expand: "piece, piece.composers, arrangers",
            })
        ).map<Result>((arrangement) => {
          return {
            id: arrangement.id,
            title: arrangement.alternateName || arrangement.expand.piece.title,
            subtitle:
              arrangement.expand.piece.expand.composers.map((composer) => composer.name).join(", ") +
              "; Arr. " +
              arrangement.expand.arrangers.map((arranger) => arranger.name),
            type: "arrangements",
            original: arrangement,
          };
        })
      );
    }

    setAllResults(results);
  };

  const clearResults: FocusEventHandler<HTMLInputElement> = (evt) => {
    evt.target.value = "";
    setAllResults([]);
    setResults([]);
  };

  const handleDebouncedSearchChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    const fuse = new Fuse(allResults, {
      keys: [
        {
          name: "original.name",
        },
        {
          name: "original.born",
          weight: 2,
        },
        {
          name: "original.died",
          weight: 2,
        },
        {
          name: "original.title",
        },
        {
          name: "original.expand.composers.name",
        },
        {
          name: "original.expand.composers.born",
          weight: 2,
        },
        {
          name: "original.expand.composers.died",
          weight: 2,
        },
        {
          name: "original.alternateName",
          weight: 1,
        },
        {
          name: "original.expand.piece.title",
          weight: 2,
        },
        {
          name: "original.expand.piece.expand.composers.name",
        },
        {
          name: "original.expand.piece.expand.composers.born",
          weight: 3,
        },
        {
          name: "original.expand.piece.expand.composers.died",
          weight: 3,
        },
        {
          name: "original.expand.arrangers.name",
        },
        {
          name: "original.expand.arrangers.born",
          weight: 3,
        },
        {
          name: "original.expand.arrangers.died",
          weight: 3,
        },
      ],
      findAllMatches: true,
    });

    const fuseResults = fuse.search(evt.target.value);

    setResults(fuseResults.map((fuseResult) => fuseResult.item));
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(debounce(handleDebouncedSearchChange, 300), [
    allResults,
  ]);

  type HandleClick = (result: Result) => MouseEventHandler<HTMLAnchorElement>;

  const handlePreload: HandleClick = (result) => (evt) => {
    evt.preventDefault();
    router.prefetch(`${baseUrlMap[result.type]}/${result.id}`);
  };

  const handleClick: HandleClick = (result) => (evt) => {
    evt.preventDefault();
    router.push(`${baseUrlMap[result.type]}/${result.id}`);
  };

  return (
    <>
      <TextField
        label="Search"
        variant="filled"
        onFocus={fetchResults}
        onBlur={clearResults}
        ref={textFieldRef}
        sx={{ flexGrow: 1, margin: "0 1rem" }}
        onChange={handleChange}
      />
      {results.length > 0 && (
        <Portal>
          <Paper
            sx={{
              position: "absolute",
              top: textFieldRef.current?.getBoundingClientRect().bottom,
              left: textFieldRef.current?.getBoundingClientRect().left,
              width: textFieldRef.current?.getBoundingClientRect().width,
            }}
          >
            <MuiList>
              {results.map((result) => {
                return (
                  <ListItem disableGutters disablePadding>
                    <ListItemButton
                      href={`${baseUrlMap[result.type]}/${result.id}`}
                      onClick={handleClick(result)}
                      onMouseEnter={handlePreload(result)}
                    >
                      <ListItemIcon>{iconMap[result.type]}</ListItemIcon>
                      <ListItemText primary={result.title} secondary={result.subtitle} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </MuiList>
          </Paper>
        </Portal>
      )}
    </>
  );
};

export default SearchBar;
