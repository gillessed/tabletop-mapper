// Copied from path js win 32 methods that I really don't want to promisify (because that's dumb)

export const PathSeparator = "\\";

const splitDeviceRe =
  /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

const splitTailRe =
  /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

function win32SplitPath(filename: string) {
  // Separate device+slash from tail
  const result = splitDeviceRe.exec(filename),
    device = (result[1] || '') + (result[2] || ''),
    tail = result[3] || '';
  // Split the tail into dir, basename and extension
  const result2 = splitTailRe.exec(tail),
    dir = result2[1],
    basename = result2[2],
    ext = result2[3];
  return [device, dir, basename, ext];
}

export function pathBasename(path: string): string {
  return win32SplitPath(path)[2];
}

function statPath(path: string) {
  var result = splitDeviceRe.exec(path),
    device = result[1] || '',
    isUnc = !!device && device[1] !== ':';
  return {
    device: device,
    isUnc: isUnc,
    isAbsolute: isUnc || !!result[2], // UNC paths are always absolute
    tail: result[3]
  };
}

function normalizeArray(parts: string[], allowAboveRoot: boolean) {
  var res = [];
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i];

    // ignore empty parts
    if (!p || p === '.')
      continue;

    if (p === '..') {
      if (res.length && res[res.length - 1] !== '..') {
        res.pop();
      } else if (allowAboveRoot) {
        res.push('..');
      }
    } else {
      res.push(p);
    }
  }

  return res;
}
function normalizeUNCRoot(device: string) {
  return '\\\\' + device.replace(/^[\\\/]+/, '').replace(/[\\\/]+/g, '\\');
}

function normalize(path: string): string {
  let result = statPath(path),
    device = result.device,
    isUnc = result.isUnc,
    isAbsolute = result.isAbsolute,
    tail = result.tail,
    trailingSlash = /[\\\/]$/.test(tail);

  // Normalize the tail path
  tail = normalizeArray(tail.split(/[\\\/]+/), !isAbsolute).join('\\');

  if (!tail && !isAbsolute) {
    tail = '.';
  }
  if (tail && trailingSlash) {
    tail += '\\';
  }

  // Convert slashes to backslashes when `device` points to an UNC root.
  // Also squash multiple slashes into a single one where appropriate.
  if (isUnc) {
    device = normalizeUNCRoot(device);
  }

  return device + (isAbsolute ? '\\' : '') + tail;
}

export function pathJoin(...paths: string[]): string {
  let joined = paths.join('\\');

  // Make sure that the joined path doesn't start with two slashes, because
  // normalize() will mistake it for an UNC path then.
  //
  // This step is skipped when it is very clear that the user actually
  // intended to point at an UNC path. This is assumed when the first
  // non-empty string arguments starts with exactly two slashes followed by
  // at least one more non-slash character.
  //
  // Note that for normalize() to treat a path as an UNC path it needs to
  // have at least 2 components, so we don't filter for that here.
  // This means that the user can use join to construct UNC paths from
  // a server name and a share name; for example:
  //   path.join('//server', 'share') -> '\\\\server\\share\')
  if (!/^[\\\/]{2}[^\\\/]/.test(paths[0])) {
    joined = joined.replace(/^[\\\/]{2,}/, '\\');
  }

  return normalize(joined);
}