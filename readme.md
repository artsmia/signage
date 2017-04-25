# Signs

for various screens throughout the museum. Simple html slideshows
featuring 1920x1080 pixel images and a caption.

Each 'sign' lives in it's own directory and is assembled from any number
of JPG images and an optional `index.md`, with text that will caption
the slides in the bottom right corner.

The idea is that each sign is a lightweight computer connected to the
internet and a TV screen. It restarts daily, pulling new content from
a webserver. Down the road we'll enable fancy live updates.

# TODO

- [ ] don't hardcode `UL-` for building screens
- [ ] don't hardcode deploy location
- [ ] don't be mac specific (remove `gls` dependency?)
- [ ] convert single slides into their own html pages?

# How it works

TODO

## Temporary screen images

For one-off events, [splitImagesAcrossThreeScreens](./Makefile#L65)
evenly distributes a set of images across three thumbdrives, which can
be installed in the signage TVs and switched to manually at the start of
the event.
